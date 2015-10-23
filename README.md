# Apiary Library Template

Library Template allows you to start a new library in couple of minutes, with
all initial setup as required or recommended.

## Installation

```
$ npm install yo -g  # make sure Yeoman is installed
$ npm install apiary-lib-template -g
```

## Usage

```
$ apiary-lib  # runs the generator
```

## Development

As the generator is written in ES6 and transpiled by Babel, it's not that
simple. Clone the repository and in the project directory (e.g.
`~/<your folder with projects>/lib-template`) do following:

```shell
$ npm install yo -g  # make sure Yeoman is installed
$ npm install  # install local version of the generator
$ npm link  # make the local version accessible to the global Yeoman generator
```

Then create yourself a separate, empty directory (e.g.
`~/<your folder with projects>/playground`) where you want to play with
the generator. In this new directory you can run:

```
$ (cd '~/<your folder with projects>/lib-template' && npm run compile) && apiary-lib
```
