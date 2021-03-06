var sse = require('./sse');
var ALIASES = [
  [ 'ok', 200 ],
  [ 'notFound', 404 ]
];

function Writer(res, match) {
  if (! (this instanceof Writer)) {
    return new Writer(res, match);
  }

  this.res = res;
  this.params = (match || {}).params || {};
}

module.exports = Writer;
var prot = Writer.prototype;

prot.write = function() {
  // pass through to the res
  this.res.write.apply(this.res, arguments);
};

prot.json = function(data) {
  if (! this.res.headersSent) {
    this.ok({
      'Content-Type': 'application/json'
    });
  }

  this.end(JSON.stringify(data));
};

prot.error = function(err) {
  if (! this.res.headersSent) {
    this.res.writeHead(500);
  }

  this.res.end('' + err);
};

prot.sse = function(callback) {
  if (! this.res.headersSent) {
    this.ok({
      'Content-Type': 'text/event-stream'
    });
  }

  callback(sse(this.res));
};

prot.text = function(data) {
  if (! this.res.headersSent) {
    this.ok({
      'Content-Type': 'text/plain'
    });
  }

  this.end(data);
};

// proxy some response methods straight through
[ 'writeHead', 'end' ].forEach(function(method) {
  prot[method] = function() {
    this.res[method].apply(this.res, arguments);
  };
});

ALIASES.forEach(function(alias) {
  prot[alias[0]] = function(headers) {
    // write the head
    this.res.writeHead(alias[1], headers);

    // return the res
    return this.res;
  };
});
