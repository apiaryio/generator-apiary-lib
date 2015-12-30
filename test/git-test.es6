
import {assert} from 'chai';

import * as git from '../src/git';


describe('Git Helpers', () => {
  describe('#exists', () => {
    describe('gets an exception', () => {
      let result;

      before(() => {
        result = git.exists(null, () => { throw new Error(); });
      });

      it('returns false', () => {
        assert.isFalse(result);
      });
    });

    describe('gets a stat object', () => {
      let result;

      before(() => {
        result = git.exists(null, () => { return {}; });
      });

      it('returns true', () => {
        assert.isTrue(result);
      });
    });
  });


  describe('#createUrl', () => {
    it('creates URL', () => {
      assert.equal(
        git.createUrl('apiaryio', 'praseodymium'),
        'git@github.com:apiaryio/praseodymium.git'
      );
    });
  });


  describe('#parseUrl', () => {
    it('parses URL', () => {
      assert.deepEqual(
        git.parseUrl('git@github.com:apiaryio/praseodymium.git'),
        {
          organization: 'apiaryio',
          repo: 'praseodymium',
          handle: 'apiaryio/praseodymium',
        }
      );
    });
  });


  describe('#getOrigin', () => {
    describe('gets unusable output', () => {
      let result;

      before(() => {
        result = git.getOrigin(() => { return '\n'; });
      });

      it('returns null', () => {
        assert.isNull(result);
      });
    });

    describe('gets a lot of output', () => {
      const remotes = `
        heroku  git@heroku.com:apiary-praseodymium-staging.git (fetch)
        heroku  git@heroku.com:apiary-praseodymium-staging.git (push)
        origin  git@github.com:apiaryio/praseodymium.git (fetch)
        origin  git@github.com:apiaryio/praseodymium.git (push)
        upstream  git@github.com:apiaryio/praseodymium-template (fetch)
        upstream  git@github.com:apiaryio/praseodymium-template (push)
      `;
      let result;

      before(() => {
        result = git.getOrigin(() => { return remotes; });
      });

      it('returns origin', () => {
        assert.equal(result, 'git@github.com:apiaryio/praseodymium.git');
      });
    });
  });


  describe('#setOrigin', () => {
    it('sets origin URL', () => {
      git.setOrigin('git@github.com:apiaryio/praseodymium.git', (command) => {
        assert.include(command, 'origin');
        assert.include(command, 'git@github.com:apiaryio/praseodymium.git');
      });
    });
  });


  describe('#getEmail', () => {
    it('gets e-mail in the context of the repository', () => {
      git.getEmail((command) => {
        assert.notInclude(command, '--global');
      });
    });
  });


  describe('#setEmail', () => {
    it('sets e-mail in the context of the repository', () => {
      git.setEmail('shenzi@apiary.io', (command) => {
        assert.notInclude(command, '--global');
      });
    });
  });
});
