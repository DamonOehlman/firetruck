module.exports = function(callback) {
  return {
    // json handler
    json: function(obj) {
      callback(null, function(req, res) {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(obj));
      });
    },

    // text handler
    text: function(text) {
      callback(null, function(req, res) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(text);
      });
    }
  };
};
