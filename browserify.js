var browserify = require('browserify');

module.exports = function(basePath) {
  return function(req, res) {
    // create a new browserify instance
    var b = browserify(basePath + req.url);

    b.on('error', function(err) {
      res.writeHead(500);
      res.end(err.toString());
    });

    b.bundle()
      .once('data', function() {
        res.writeHead(200, {
          'Content-Type': 'application/javascript; encoding=utf8'
        });
      })
      .pipe(res);
  };
};
