/* jshint node: true */
'use strict';

var debug = require('debug')('firetruck');
var http = require('http');
var https = require('https');
var mapleTree = require('mapleTree');

/**
  # firetruck

  A simple http server with simple routing courtesy of
  [mapleTree](https://github.com/saambarati/mapleTree)

  ```js
  var firetruck = require('firetruck');
  var app = firetruck();
  ```

**/
var firetruck = module.exports = function() {

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

  /**
    ### attach(server)

    Attach the firetruck application to the specified server instance
  **/
  app.attach = function(target) {
    debug('attaching to server');
    target.on('request', function(req, res) {
      var match = router.match(req.url);

      debug('received request: ' + req.url + ', got match: ' + (!!match));
      if (match.fn) {
        match.fn(req, res);
      }
    });
  };

  return app;
};

firetruck.json = require('./json');