module.exports = function(callback) {
  return {
    // json handler
    json: function(obj) {
      // if we've been provided a function, then we need to do some of the dirty work
      if (typeof obj == 'function') {
        return callback(null, function(req, res) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });

          obj(req, res);
        });
      }

      callback(null, function(req, res) {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(obj));
      });
    },

    // text handler
    text: function(text) {
      if (typeof text == 'function') {
        return callback(null, function(req, res) {
          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });

          text(req, res);
        });
      }

      callback(null, function(req, res) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(text);
      });
    }
  };
};
