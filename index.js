/* jshint node: true */
'use strict';

var async = require('async');
var debug = require('debug')('firetruck');
var mapleTree = require('mapleTree');
var path = require('path');
var fs = require('fs');
var st = require('st');
var Writer = require('./writer');

/**
  # firetruck

  A simple, opinionated server unframework for getting stuff done.

  ## Example Usage

  <<< examples/simple-server.js

  ## Structuring your prototype

  If you are using firetruck, then you are prototyping. There can be no other reason.
  This being the case the directory structure of your prototype probably looks
  something like the following:

  ```
  |- client
     |- static
        |- index.html
     |- js
        |- app.js
  |- server.js
  ```

  Firetruck uses convention over configuration to save you writing boilerplate code,
  and will behave in the following way:

  - If it intercepts a request for a `.js` file, browserify will browserify it and spit
    out the result. No caching.  JS files are sources from the `client/js` directory.

  - If it intercepts a request for a registered route, your handler will be invoked.

  - Otherwise, [st](https://github.com/isaacs/st) will be used to serve static content
    from the `client/static` directory.

  ## Reference

**/
var firetruck = module.exports = function(server, opts) {

  // get the base dir
  var basePath = (opts || {}).basePath || guessBaseDir();
  var clientPath = path.resolve(basePath, (opts || {}).clientPath || 'client');

  /**
    ### app(route, handler)

    ```js
    app('/index', function(req, res) {
      res.writeHead(200);
      res.write('hello');
      res.end();
    });
    ```
  **/
  var app = function(route, handler) {
    var builder;

    // if the handler is an object (GET, PUT, POST, DELETE endpoints)
    if (typeof handler == 'object') {
      handler = createMethodHandler(handler);
    }

    // if the handler has been defined, register immediately
    if (typeof handler != 'function') {
      throw new Error('A handler function is required to register a route');
    }

    router.define(route, function(req, res) {
      handler.call(new Writer(res, this), req);
    });

    return app;
  };


  // create the route tree
  var router = app.router = new mapleTree.RouteTree();

  function createMethodHandler(mod) {
    var handlers = {};

    // ensure we have uppercase versions of the method endpoints
    Object.keys(mod).forEach(function(key) {
      handlers[key.toUpperCase()] = mod[key];
    });

    return function(req) {
      var handler = handlers[req.method];

      if (typeof handler != 'function') {
        return this.notFound();
      }

      return handler.call(this, req);
    };
  }

  function guessBaseDir() {
    return module && module.parent && path.dirname(module.parent.filename);
  }

  function handleRequest(req, res) {
    var match = router.match(req.url);

    debug('received request: ' + req.url + ', got match: ' + !!(match && match.fn));
    if (typeof match.fn == 'function') {
      match.fn(req, res);
    }
    else {
      debug('not found, writing 404');
      res.writeHead(404);
      res.end('not found');
    }
  };

  /**
    ### attach(server)

    Attach the firetruck application to the specified server instance
  **/
  app.attach = function(target) {
    debug('attaching to server');
    target.on('request', handleRequest);
  };

  /**
    ### detach(server)

    Detach from the specified server.
  **/
  app.detach = function(target) {
    target.removeListener('request', handleRequest);
  };

  /**
    ### browserify(targetFolder)

    This is a helper to pass all .js files through the `firetruck/browserify` helper.
  **/
  app.browserify = function(basePath) {
    router.define(/^(.*\.js)$/, browserify(basePath));
  };

  // if we have been provided a server instance, then attach immediately
  if (server) {
    app.attach(app.server = server);
  }

  fs.exists(clientPath, function(exists) {
    var mount;

    if (! exists) {
      return;
    }

    // mount the static serving endpoint
    mount = st({ path: path.resolve(clientPath, 'static'), cache: false, index: 'index.html' });

    app.browserify(path.resolve(clientPath, 'js'));
    router.define('/*', mount);
    router.define('/', mount);
  });

  return app;
};

var browserify = firetruck.browserify = require('./browserify');
