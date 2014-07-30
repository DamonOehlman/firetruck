var reLineBreak = /\n\r?/g;

module.exports = function(res) {
  var heartbeatTimer;

  function resetHeartbeat() {
    clearTimeout(heartbeatTimer);

    heartbeatTimer = setTimeout(function() {
      res.write(':hb\n\n');

      // queue another heartbeat write
      heartbeatTimer = resetHeartbeat();
    }, 5000);
  }

  function writer(type, payload) {
    function write(data) {
      resetHeartbeat();

      if (type) {
        res.write('event: ' + type + '\n');
      }

      res.write('data: ' + ('' + data).split(reLineBreak).filter(Boolean).join('||') + '\n\n');
    }

    return payload ? write(payload) : write;
  }

  writer.close = res.end.bind(res);

  resetHeartbeat();
  return writer;
};
