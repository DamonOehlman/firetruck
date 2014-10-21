# firetruck

A simple, opinionated server unframework for getting stuff done.


[![NPM](https://nodei.co/npm/firetruck.png)](https://nodei.co/npm/firetruck/)

[![experimental](https://img.shields.io/badge/stability-experimental-red.svg)](https://github.com/dominictarr/stability#experimental) 

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

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
