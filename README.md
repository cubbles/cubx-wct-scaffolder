# cubx-wct-scaffolder


npm package for generate wct test scaffold for cubbles components.

## Install

    npm install cubx-wct-scaffolder

## API
    var path = require('path');
    var scaffolder = require('cubx-wct-scaffolder')
    // Path to webpackage
    var webpackagePath = path.join(process.cwd(),'..','webpackages','my-webpackage');
    scaffolder.scaffold(webpacakgePath);


## CLI

### Run (standalone)
    cubx-wct-scaffolder <webpackagePath> [--loglevel <loglevel>]

* __webpackagePath__: relative or absolut path of the webpackage.
* __--loglevel__: loglevel for console logging. Possible values [silly,debug,info,warn,error], default value: info


[npm-image]: https://img.shields.io/npm/v/cubx-wct-scaffolder.svg?style=flat
[npm-url]: https://npmjs.org/package/cubx-wct-scaffolder
