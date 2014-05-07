# firetruck

A simple, opinionated server unframework for getting stuff done.

## Example Usage

```js
var server = require('http').createServer();
var app = require('firetruck')(server);

// listen on port 3000
server.listen(3000);

```

## Structuring your prototype

If you are using firetruck, then you are prototyping. There can be no other reason.
This being the case the directory structure of your prototype probably looks
something like the following:

```
|- client
   |- static
      |- index.html
   |- js
      |- app.js
|- server.js
```

Firetruck uses convention over configuration to save you writing boilerplate code,
and will behave in the following way:

- If it intercepts a request for a `.js` file, browserify will browserify it and spit
  out the result. No caching.  JS files are sources from the `client/js` directory.

- If it intercepts a request for a registered route, your handler will be invoked.

- Otherwise, [st](https://github.com/isaacs/st) will be used to serve static content
  from the `client/static` directory.

## Reference

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
