# Apiary Library Generator

Apiary's Yeoman generator for basic project scaffolding. Allows you to start
a new library in couple of minutes, with all initial setup as required or
recommended by internal directions.

![Demo](https://github.com/apiaryio/generator-apiary-lib/blob/master/assets/demo.gif?raw=true)

## Templates

- `coffee` for CoffeeScript
- `es5` for JavaScript
- `es6` for ECMAScript2015

### Adding a new template

The generator was made with the idea of having templates available also for
languages not based on JavaScript, but the initial version doesn't feature any.
If you want to contribute a template for Ruby, Python, or other language, feel
free to do so, but you might need to perform some changes also to the generator
itself, as there is probably some code, which is JavaScript-specific and not
general enough. This is a known limitation and an unfortunate burden put on
the first contributors, but thanks to it the generator could become real very
quickly.

## Installation

```shell
$ npm install yo -g  # make sure Yeoman is installed
$ npm install generator-apiary-lib -g
```

## Usage

```shell
$ apiary-lib  # runs the generator
```

## Development

As the generator is written in ES6 and transpiled by Babel, seamless
development of it is not so simple. Clone the repository and in the
project directory (e.g. `~/<your folder with projects>/generator-apiary-lib`)
do following:

```shell
$ npm install yo -g  # make sure Yeoman is installed
$ npm install  # install local version of the generator
$ npm link  # make the local version accessible to the global Yeoman generator
```

Then create yourself a separate, empty directory (e.g.
`~/<your folder with projects>/playground`) where you want to play with
the generator. In this new directory you can run:

```shell
$ (cd '~/<your folder with projects>/generator-apiary-lib' && npm run compile) && apiary-lib
```

## TODO

- [ ] [add generator tests](http://yeoman.io/authoring/testing.html)
- [ ] add Docker
- [ ] [make templates more DRY](https://github.com/tj/ejs#includes)

## Ideas

- Automatically append several selected [global ignores](https://github.com/github/gitignore/blob/master/Global/) to `./.git/info/exclude`.
- As the last thing, open README.md in user's editor (using the `EDITOR` environment variable).
