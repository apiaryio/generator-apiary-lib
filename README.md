# Apiary Library Generator

Apiary's Yeoman generator for basic project scaffolding. Allows you to start
a new library in couple of minutes, with all initial setup as required or
recommended by internal directions.

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

As the generator is written in ES6 and transpiled by Babel, it's not so
simple. Clone the repository and in the project directory (e.g.
`~/<your folder with projects>/generator-apiary-lib`) do following:

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

- [ ] sample mocha test with chai assert for every template
- [ ] https://github.com/apiaryio/plutonium/blob/master/.npmrc
- [ ] make stub of README for every template (installation etc. is the same)
- [ ] finish *this* README (also add animated gif with progress of the form)
- [ ] add docker

### Inspiration

- coffee: https://github.com/apiaryio/metamorphoses
- es6: https://github.com/apiaryio/deckardcain / https://github.com/apiaryio/killswitch
- es5: https://github.com/apiaryio/plutonium
