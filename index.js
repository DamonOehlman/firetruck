/* jshint node: true */
'use strict';

var debug = require('debug')('firetruck');
var mapleTree = require('mapleTree');

/**
  # firetruck

  A simple, opinionated server unframework for getting stuff done.

  ### Example Usage

  <<< examples/simple-server.js
**/
var firetruck = module.exports = function(server) {

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

  // if we have been provided a server instance, then attach immediately
  if (server) {
    app.attach(server);
  }

  return app;
};
