var server = require('http').createServer();
var app = require('..')(server);

app('/test', function(req) {
  this.ok();
  this.write('test');
  this.end();
});

// listen on port 3000
server.listen(3000);
