# <%= name %>

<%= description %>

<% if (ci.indexOf('circle.yml') !== -1) { %>
[![CircleCI Build Status](https://circleci.com/gh/<%= gitHub.handle %>.svg?style=shield)](https://circleci.com/gh/<%= gitHub.handle %>)
<% } %><% if (ci.indexOf('.travis.yml') !== -1) { %>
[![TravisCI Build Status](https://travis-ci.org/<%= gitHub.handle %>.svg?branch=master)](https://travis-ci.org/<%= gitHub.handle %>)
<% } %><% if (ci.indexOf('appveyor.yml') !== -1) { %>
[![Appveyor Build status](https://ci.appveyor.com/api/projects/status/.../branch/master?svg=true)](https://ci.appveyor.com/project/Apiary/<%= packageName %>/branch/master)
<% } %>

## Usage

_TBD_

## Installation

```shell
$ npm install <%= packageName %>
```

## Development

`<%= packageName %>` is written in [ES6](http://babeljs.io/docs/learn-es2015/).
For that reason the source code is located in the `src` directory. The `lib`
directory contains compiled code and isn't part of the repository. However,
installing the library in a regular way should work:

```shell
$ npm install
$ npm test
```

To compile the code manually, use:

```shell
$ npm run compile
```

By default, tests are ran on server as well as in the browser, using
[Karma](karma-runner.github.io/). To ran manually just one specific type, use:

```shell
$ npm run server-test
$ npm run browser-test
```

## License

<% if (locals.license) { %>
<%= license %> (see `LICENSE` file)
<% } else { %>
Commercial License
<% } %>
<%= company %> <support@apiary.io>
