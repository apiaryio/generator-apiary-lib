
import * as _ from 'lodash';
import * as path from 'path';
import {assert} from 'chai';
import * as yeoman from 'yeoman-generator';


const generatorPath = path.join(__dirname, '../app');


function feed(input, done) {
  let generator;
  yeoman.test
    .run(generatorPath)
    .withPrompts(input)
    .on('ready', (gen) => { generator = gen; })
    .on('end', () => { done(null, generator); });
}


describe('Generator', () => {
  const input = {
    email: 'shenzi',
  };

  describe('Project is not OSS', () => {
    describe('Package name does not have the @apiaryio prefix', () => {
      let output;

      before((done) => {
        feed(_.assign(input, {
          openSource: false,
          packageName: 'package',
        }), (err, generator) => {
          output = generator.data;
          done(err);
        });
      });

      it('package name gets automatically prefixed', () => {
        assert.equal(output.packageName, '@apiaryio/package');
      });

      it('the project has no license', () => {
        assert.notOk(output.license);
      });

      it('the project has no license file', () => {
        yeoman.assert.noFile(['LICENSE']);
      });
    });


    describe('Package name does have the @apiaryio prefix', () => {
      let output;

      before((done) => {
        feed(_.assign(input, {
          openSource: false,
          packageName: '@apiaryio/package',
        }), (err, generator) => {
          output = generator.data;
          done(err);
        });
      });

      it('package name does not get redundant prefix', () => {
        assert.equal(output.packageName, '@apiaryio/package');
      });

      it('the project has no license', () => {
        assert.notOk(output.license);
      });

      it('the project has no license file', () => {
        yeoman.assert.noFile(['LICENSE']);
      });
    });


    describe('Project is OSS', () => {
      let output;

      before((done) => {
        feed(_.assign(input, {
          openSource: true,
          packageName: 'package',
        }), (err, generator) => {
          output = generator.data;
          done(err);
        });
      });

      it('package name does not get any prefix', () => {
        assert.equal(output.packageName, 'package');
      });

      it('the project has a license', () => {
        assert.equal(output.license, 'MIT');
      });

      it('the project has a license file', () => {
        yeoman.assert.file(['LICENSE']);
      });
    });
  });


  describe('If e-mail given as company username', () => {
    let output;

    before((done) => {
      feed({email: 'shenzi'}, (err, generator) => {
        output = generator.data;
        done(err);
      });
    });

    it('is extended to full e-mail address', () => {
      assert.equal(output.email, 'shenzi@apiary.io');
    });
  });
});
