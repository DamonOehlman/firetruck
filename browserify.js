var debug = require('debug')('firetruck:browserify');
var browserify = require('browserify');

module.exports = function(basePath) {
  return function(req, res) {
    // create a new browserify instance
    var b = browserify(basePath + req.url, { debug: true });

    function handleError(err) {
      debug('encountered error attempting to browserify url: ' + req.url, err);

      res.writeHead(500);
      res.end(err.toString());
    }

    b.on('error', handleError);
    b.bundle()
      .on('error', handleError)
      .once('data', function() {
        res.writeHead(200, {
          'Content-Type': 'application/javascript; encoding=utf8'
        });
      })
      .pipe(res);
  };
};
