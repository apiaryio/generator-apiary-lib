
import * as fs from 'fs';
import * as path from 'path';
import deasync from 'deasync';
import * as childProcess from 'child_process';

const execSync = deasync(childProcess.exec); // exported for tests


/**
 * Checks whether Git repository exists in the current working directory.
 */
export function exists(cwd = null, statFn = null) {
  const stat = statFn || fs.statSync;
  try {
    return !!stat(path.join(cwd || process.cwd(), '.git'));
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
 * Parses GitHub URL to object with details.
 */
export function parseUrl(url) {
  const match = url.match(/(\w+)\/(\w+)/);
  return {organization: match[1], repo: match[2], handle: match[0]};
}


/**
 * Retrieves Git remote origin URL of the repository in current working
 * directory.
 */
export function getOrigin(execFn = null) {
  const exec = execFn || execSync;
  const stdout = exec('git remote -v');
  if (!stdout) {
    return null;
  }
  const match = stdout.match(/origin\s+(\S+@\S+)/);
  return match ? match[1] : null;
}


/**
 * Sets Git remote origin URL to the repository in current working directory.
 */
export function setOrigin(url, execFn = null) {
  const exec = execFn || execSync;
  return exec(`git remote add origin ${url}`);
}


/**
 * Gets user's e-mail effective for current repository.
 */
export function getEmail(execFn = null) {
  const exec = execFn || execSync;
  return exec('git config user.email');
}


/**
 * Sets given e-mail as user's e-mail for current repository.
 */
export function setEmail(email, execFn = null) {
  const exec = execFn || execSync;
  return exec(`git config user.email '${email}'`);
}


/**
 * Initializes Git repository in current working directory.
 */
export function init(execFn = null) {
  const exec = execFn || execSync;
  return exec('git init');
}
