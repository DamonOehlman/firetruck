var firetruck = require('..');
var app = firetruck();
var test = require('tape');
var http = require('http');
var request = require('hyperquest');
var server = http.createServer();

test('create index route', function(t) {
  t.plan(1);
  app('/index', function(req) {
    this.writeHead(200);
    this.write('hello');
    this.end();
  });

  t.ok(app.router.match('/index').perfect, 'found /index route');
});

test('attach to http server', function(t) {
  t.plan(1);
  app.attach(server);
  t.pass();
});

test('start server', function(t) {
  t.plan(1);
  server.listen(3000, function(err) {
    t.ifError(err);
  });
});

test('request', function(t) {
  t.plan(1);
  request.get('http://localhost:3000/index', function(err, res) {
    t.equal(res.statusCode, 200);
  });
});

test('stop server', function(t) {
  t.plan(1);
  server.close();
  t.pass('server stopped');
});
