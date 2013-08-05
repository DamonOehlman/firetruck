# firetruck

A simple http server with simple routing courtesy of
[mapleTree](https://github.com/saambarati/mapleTree)

```js
var firetruck = require('firetruck');
var app = firetruck();
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
