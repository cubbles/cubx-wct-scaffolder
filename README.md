# cubx-wct-scaffolder

Npm package for generate wct test scaffold for cubbles components. It developed for exclusive usage in cubbles projects.

## Install

    npm install cubx-wct-scaffolder

## API
    var path = require('path');
    var scaffolder = require('cubx-wct-scaffolder')
    // Path to webpackage
    var webpackagePath = path.join(process.cwd(), '..', 'webpackages', 'my-webpackage');
    scaffolder.scaffold(webpackagePath);

It realise the following steps:
* Read the manifest.webpackage, and extracted the artifactId-s  of all compound and elementary components.
* Ask for select the dstination artifact( This artifact will be completed with the wct test scaffold.
* Generate the subdirectory `test` in the artifact directory, and generate all necessary files for tests.
* Install and add the necessary dependencies to package.json.

## CLI

### Run (standalone)
    cubx-wct-scaffolder <webpackagePath> [--loglevel <loglevel>]

* __webpackagePath__: relative or absolut path of the webpackage.
* __--loglevel__: loglevel for console logging. Possible values [silly,debug,info,warn,error], default value: info


[npm-image]: https://img.shields.io/npm/v/cubx-wct-scaffolder.svg?style=flat
[npm-url]: https://npmjs.org/package/cubx-wct-scaffolder
