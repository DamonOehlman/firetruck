/* jshint node: true */
'use strict';

var async = require('async');
var debug = require('debug')('firetruck');
var mapleTree = require('mapleTree');
var path = require('path');
var fs = require('fs');
var st = require('st');

/**
  # firetruck

  A simple, opinionated server unframework for getting stuff done.

  ### Example Usage

  <<< examples/simple-server.js
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
    router.define(route, handler);
  };


  // create the route tree
  var router = app.router = new mapleTree.RouteTree();

  function guessBaseDir() {
    return module && module.parent && path.dirname(module.parent.filename);
  }

  function handleRequest(req, res) {
    var match = router.match(req.url);

    debug('received request: ' + req.url + ', got match: ' + (!!match));
    if (match.fn) {
      match.fn(req, res);
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
    app.attach(server);
  }

  fs.exists(clientPath, function(exists) {
    if (! exists) {
      return;
    }

    app.browserify(path.resolve(clientPath, 'js'));
    router.define('/*', st(path.resolve(clientPath, 'static')));
  });

  return app;
};

var browserify = firetruck.browserify = require('./browserify');
