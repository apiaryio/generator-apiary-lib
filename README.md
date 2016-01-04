# Apiary Library Generator

Apiary's Yeoman generator for basic project scaffolding. Allows you to start
a new library in couple of minutes, with all initial setup as required or
recommended by internal directions.

[![CircleCI Build Status](https://circleci.com/gh/apiaryio/generator-apiary-lib.svg?style=shield)](https://circleci.com/gh/apiaryio/generator-apiary-lib)

## Demo

![Demo](https://github.com/apiaryio/generator-apiary-lib/blob/master/assets/demo.gif?raw=true)

## Templates

- `coffee` for CoffeeScript
- `es5` for JavaScript
- `es2015` for ECMAScript2015

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

Use the generator **in the root of your project**. If you want to start a new
project, create yourself a new project directory. The generator doesn't have
to be ran in an empty directory, though.

```shell
$ mkdir ~/<your directory with projects>/<project directory>
$ cd ~/<your directory with projects>/<project directory>
$ apiary-lib  # runs the generator
```

You shouldn't need to worry about existing `.git` directory or other files.
The generator will ask you should it ever need to overwrite an existing file.
Also, Git helps in case something gets overwritten. This way you should be able
to use the template also on existing projects, not only on new ones.

## Development

As the generator is written in ES6 and transpiled by Babel, seamless
development of it is not so simple. Clone the repository and in the
project directory (e.g. `~/<your directory with projects>/generator-apiary-lib`)
do following:

```shell
$ npm install yo -g  # make sure Yeoman is installed
$ npm install  # install local version of the generator
$ npm link  # make the local version accessible to the global Yeoman generator
```

Then create yourself a separate, empty directory (e.g.
`~/<your directory with projects>/playground`) where you want to play with
the generator. In this new directory you can run:

```shell
$ (cd ~/<your directory with projects>/generator-apiary-lib && npm run compile) && apiary-lib
```
