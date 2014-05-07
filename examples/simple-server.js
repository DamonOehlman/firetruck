var server = require('http').createServer();
var app = require('..')(server);

// listen on port 3000
server.listen(3000);
