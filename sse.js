var reLineBreak = /\n\r?/g;

module.exports = function(res) {
  function writer(type, payload) {
    function write(data) {
      if (type) {
        res.write('event: ' + type + '\n');
      }

      res.write('data: ' + ('' + data).split(reLineBreak).filter(Boolean).join('||') + '\n\n');
    }

    return payload ? write(payload) : write;
  }

  writer.close = res.end.bind(res);

  return writer;
};
