
import * as fs from 'fs';
import * as path from 'path';
import {exec} from 'child_process';


/**
 * Checks whether Git repository exists in the current working directory.
 */
export function exists() {
  try {
    return !!fs.statSync(path.join(process.cwd(), '.git'));
  } catch (err) {
    return false;
  }
}


/**
 * Creates GitHub URL from given details.
 */
export function createUrl(organization, repo) {
  return 'git@github.com:' + organization + '/' + repo + '.git';
}


/**
 * Asynchronously retrieves Git remote origin URL of the repository in
 * current working directory.
 */
export function getOrigin(done) {
  exec('git remote -v', (err, stdout) => {
    if (err || !stdout) {
      return done(err, null);
    }
    const match = stdout.match(/\S+@\S+/);
    done(null, match ? match[0] : null);
  });
}


/**
 * Asynchronously sets Git remote origin URL to the repository in
 * current working directory.
 */
export function setOrigin(url, done) {
  return exec(`git remote add origin ${url}`, done);
}


/**
 * Asynchronously initializes Git repository in current working directory.
 */
export function init(done) {
  return exec(`git init`, done);
}
