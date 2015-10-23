
import * as fs from 'fs';
import * as path from 'path';

import {Base} from 'yeoman-generator';
import {humanize, titleize} from 'underscore.string';
import {assign, trim} from 'lodash';
import async from 'async';
import glob from 'glob';

import * as git from './git';


export default class ApiaryLibGenerator extends Base {
  constructor() {
    super(...arguments);

    this.templatesDir = path.join(__dirname, 'templates');
    this.templates = fs.readdirSync(this.templatesDir);

    this.data = {};
  }

  initializing() {
    const done = this.async();

    // If Git repository doesn't exist in the current working directory yet,
    // let's initialize one
    if (!git.exists()) {
      this.log(`Git not initialized. Executing 'git init'`);
      return git.init(done);
    }
    done();
  }

  prompting() {
    const done = this.async();

    this.log(`
      Before filling the form, read internal directions at
      https://docs.apiary-internal.com/content/projects.html
    `);
    this.prompt([
      {
        name: 'name',
        message: 'Human-readable project name',
        default: titleize(humanize(path.basename(process.cwd()))),
      },
      {
        name: 'packageName',
        message: 'Package name',
        default: path.basename(process.cwd()),
      },
      {
        name: 'description',
        message: 'Human-readable description in one sentence',
        validate: (input) => {
          if (!trim(input)) {
            return 'Description is required.';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'template',
        message: 'Template type',
        default: 'es6',
        choices: this.templates,
      },
      {
        type: 'list',
        name: 'company',
        message: 'Company you work for',
        default: () => {
          if (new Date().getTimezoneOffset() > 2) {
            return 'Apiary Inc.';
          }
          return 'Apiary Czech Republic, s.r.o.';
        },
        choices: ['Apiary Inc.', 'Apiary Czech Republic, s.r.o.'],
      },
      {
        type: 'confirm',
        name: 'openSource',
        message: 'Open Source',
        default: true,
      },
    ], (answers) => {
      assign(this.data, answers);
      done();
    });
  }

  promptingGit() {
    const done = this.async();

    async.waterfall([
      (next) => {
        // Getting the Git remote origin URL
        git.getOrigin(next);
      },
      (gitUrl, next) => {
        // If we successfully got the URL, we're done here
        if (gitUrl) {
          this.data.gitUrl = gitUrl;
          return done();
        }
        // Otherwise we need to prompt for the remote Git repository URL
        this._promptForGitUrl(next);
      },
      (answers, next) => {
        // We've got the answers, we save them
        this.data.gitUrl = answers.gitUrl;
        this.data.gitHub = answers.gitHub;

        // We set the origin to the value we've got from user
        this.log(`Setting Git origin to '${answers.gitUrl}'`);
        git.setOrigin(answers.gitUrl, next);
      },
    ], done);
  }

  _promptForGitUrl(done) {
    // We prompt for GitHub organization and repository name
    this.prompt([
      {
        name: 'organization',
        message: 'GitHub organization name',
        default: 'apiaryio',
      },
      {
        name: 'repo',
        message: 'GitHub repository name',
        default: path.basename(process.cwd()),
      },
    ], (gitHub) => {
      // Once we have GitHub details, we can construct the remote Git
      // repository URL ourselves, but just to be sure, let's have it confirmed
      // from the user
      this.prompt([
        {
          name: 'gitUrl',
          message: 'Git repository URL',
          default: git.createUrl(gitHub.organization, gitHub.repo),
        },
      ], (answers) => {
        // We provide everything we've learned to the callback
        done(null, {gitUrl: answers.gitUrl, gitHub});
      });
    });
  }

  configuring() {
    // Making some decisions and corrections according to provided
    // Open Source flag
    if (this.data.openSource) {
      this.data.license = 'MIT';
    } else if (!this.data.packageName.match(/^@apiaryio\//)) {
      this.data.packageName = `@apiaryio/${this.data.packageName}`;
    }

    // Setting source directory to selected template
    this.sourceRoot(path.join(this.sourceRoot(), this.data.template));
  }

  writing() {
    // We iterate over all files in source folder and treat them as templates.
    // We provide this.data as the context for the templates. The glob pattern
    // takes also directories, but this.template() seems to ignore them, so
    // no special treatment is in place to filter them.
    const dir = this.sourceRoot();
    const reDirPrefix = new RegExp(`^${dir}/*`);

    const files = glob.sync(path.join(dir, '**/*'));
    files.forEach((fullPath) => {
      const relativePath = fullPath.replace(reDirPrefix, '');
      this.template(relativePath, this.data);
    });
  }
}
