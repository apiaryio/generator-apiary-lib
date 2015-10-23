
// import * as fs from 'fs';
import * as path from 'path';
import {Base} from 'yeoman-generator';
import async from 'async';

import * as git from './git';


export default class ApiaryLibGenerator extends Base {
  constructor() {
    super(...arguments);

    // this.templatesDir = path.join(__dirname, '..', 'templates');
    // this.templates = fs.readdirSync(this.templatesDir);
    this.info = {};
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

    async.waterfall([
      (next) => {
        // Getting the Git remote origin URL
        git.getOrigin(next);
      },
      (gitUrl, next) => {
        // If we successfully got the URL, we're done here
        if (gitUrl) {
          this.info.gitUrl = gitUrl;
          return done();
        }
        // Otherwise we need to prompt for the remote Git repository URL
        this._promptForGitUrl(next);
      },
      (answers, next) => {
        // We've got the answers, we save them
        this.info.gitUrl = answers.gitUrl;
        this.info.gitHub = answers.gitHub;

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

  promptingX() {
    this.log(this.info);
  }
}


// _promptForProjectName(done) {
//   this.prompt([
//     {
//       name: 'packageName',
//       message: 'Package name',
//       default: path.basename(process.cwd()),
//     },
//   ], done);
// }

// //   // {
// //   //   type    : 'list',
// //   //   name    : 'template',
// //   //   message : 'Template',
// //   //   default : 'es6',
// //   //   choices : this.templates,
// //   // },
