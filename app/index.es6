
import * as fs from 'fs';
import * as path from 'path';

import {Base} from 'yeoman-generator';
import {humanize, titleize} from 'underscore.string';
import {assign, trim} from 'lodash';
import glob from 'glob';

import * as git from './git';


export default class ApiaryLibGenerator extends Base {

  constructor() {
    super(...arguments);

    this.templatesDir = path.join(__dirname, 'templates');
    this.templates = fs.readdirSync(this.templatesDir);

    this.choices = {
      ci: ['circle.yml', '.travis.yml', 'appveyor.yml'],
      company: ['Apiary Czech Republic, s.r.o.', 'Apiary Inc.'],
    };
    this.data = {};
  }

  initializing() {
    // If Git repository doesn't exist in the current working directory yet,
    // let's initialize one
    if (!git.exists()) {
      this.log(`Git not initialized. Executing 'git init'`);
      git.init();
    }
  }

  prompting() {
    const done = this.async();

    this.log('\n\nBefore filling the form, read internal directions at\n' +
             'https://docs.apiary-internal.com/content/projects.html\n\n');
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
        type: 'checkbox',
        name: 'ci',
        message: 'Continuous Integration',
        default: [this.choices.ci[0]],
        choices: this.choices.ci,
      },
      {
        name: 'email',
        message: 'Your company e-mail or username (shenzi@apiary.io or shenzi)',
        default: () => {
          const email = git.getEmail();
          if (email.match(/@apiary\.io$/)) {
            return email;
          }
        },
        validate: (input) => {
          const email = trim(input);
          if (!email) {
            return 'E-mail is required.';
          }
          if (email.match(/@/) && !email.match(/@apiary\.io$/)) {
            return 'Your e-mail has to end with @apiary.io';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'company',
        message: 'Company you work for',
        default: () => {
          const index = (new Date().getTimezoneOffset() > 2) ? 1 : 0;
          return this.choices.company[index];
        },
        choices: this.choices.company,
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
    const gitUrl = git.getOrigin();

    if (gitUrl) {
      this.data.gitOriginMissing = false;
      this.data.gitUrl = gitUrl;
      return done();
    }

    this._promptForGitUrl((answers) => {
      this.data.gitOriginMissing = true;
      this.data.gitUrl = answers.gitUrl;
      this.data.gitHub = answers.gitHub;
      done();
    });
  }

  _promptForGitUrl(callback) {
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
      // Once we have GitHub details, we can construct the remote Git repo URL
      // ourselves, but just to be sure, let's have it confirmed from the user
      this.prompt([
        {
          name: 'gitUrl',
          message: 'Git repository URL',
          default: git.createUrl(gitHub.organization, gitHub.repo),
        },
      ], (answers) => {
        // We provide everything we've learned to the callback
        callback({gitUrl: answers.gitUrl, gitHub});
      });
    });
  }

  configuring() {
    if (this.data.openSource) {
      // License for Open Source projects
      this.data.license = 'MIT';
    } else if (!this.data.packageName.match(/^@apiaryio\//)) {
      // Not an Open Source? Then the package name should have @apiaryio prefix
      this.data.packageName = `@apiaryio/${this.data.packageName}`;
    }

    // E-mail auto-completion
    if (!this.data.email.match(/@apiary\.io$/)) {
      this.data.email += '@apiary.io';
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

      // If the file is in CI options, but was not selected by user, then
      // we want to skip it.
      if (this.choices.ci.indexOf(relativePath) !== -1 ||
          this.data.ci.indexOf(relativePath) === -1) {
        return;
      }

      this.template(relativePath, this.data);
    });

    // Git
    if (this.data.gitOriginMissing) {
      this.log(`Setting Git origin to '${this.data.gitUrl}'`);
      git.setOrigin(this.data.gitUrl);
    }
    git.setEmail(this.data.email);

    // Git ignore
    // Put
    //
    // - https://github.com/github/gitignore/blob/master/Global/Linux.gitignore
    // - https://github.com/github/gitignore/blob/master/Global/OSX.gitignore
    // - https://github.com/github/gitignore/blob/master/Global/Windows.gitignore
    // - https://github.com/github/gitignore/blob/master/Global/Vim.gitignore
    // - https://github.com/github/gitignore/blob/master/Global/SublimeText.gitignore
    // - https://github.com/github/gitignore/blob/master/Global/JetBrains.gitignore
    // - https://github.com/github/gitignore/blob/master/Global/Emacs.gitignore
    //
    // to
    //
    // - ./.git/info/exclude

    // README
    // opening README in your editor, EDITOR env var
  }
}
