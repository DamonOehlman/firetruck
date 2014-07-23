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

prot.json = function(data) {
  if (! this.res.headersSent) {
    this.ok({
      'Content-Type': 'application/json'
    });
  }

  this.end(JSON.stringify(data));
};

// proxy some response methods straight through
[ 'writeHead', 'end' ].forEach(function(method) {
  prot[method] = function() {
    this.res[method].apply(this.res, arguments);
  };
});

ALIASES.forEach(function(alias) {
  prot[alias[0]] = function(headers) {
    this.res.writeHead(alias[1], headers);
  };
});
