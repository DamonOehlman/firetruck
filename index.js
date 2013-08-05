/* jshint node: true */
'use strict';

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

  // create the route tree
  var routes = new mapleTree.RouteTree();
  var app = function(route, handler) {
  };

  // attach a listen method
  app.attach = function() {
  };

  return app;
};

