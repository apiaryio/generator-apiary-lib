
import * as fs from 'fs';
import * as path from 'path';
import deasync from 'deasync';
import * as childProcess from 'child_process';

const exec = deasync(childProcess.exec);


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
 * Retrieves Git remote origin URL of the repository in current working
 * directory.
 */
export function getOrigin() {
  const stdout = exec('git remote -v');
  if (!stdout) {
    return null;
  }
  const match = stdout.match(/\S+@\S+/);
  return match ? match[0] : null;
}


/**
 * Sets Git remote origin URL to the repository in current working directory.
 */
export function setOrigin(url) {
  return exec(`git remote add origin ${url}`);
}


/**
 * Gets user's e-mail effective for current repository.
 */
export function getEmail() {
  return exec('git config user.email');
}


/**
 * Sets given e-mail as user's e-mail for current repository.
 */
export function setEmail(email) {
  return exec(`git config user.email '${email}'`);
}


/**
 * Initializes Git repository in current working directory.
 */
export function init() {
  return exec('git init');
}
