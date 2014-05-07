# firetruck

A simple, opinionated server unframework for getting stuff done.

### Example Usage

```js
var firetruck = require('firetruck');

firetruck()
  .
  .listen()
```

### app(route, handler)

```js
app('/index', function(req, res) {
  res.writeHead(200);
  res.write('hello');
  res.end();
});
```

### attach(server)

Attach the firetruck application to the specified server instance

### detach(server)

Detach from the specified server.

### browserify(targetFolder)

This is a helper to pass all .js files through the `firetruck/browserify` helper.
