self.addEventListener('message', function(msg) {
  setTimeout(function() {
    switch (msg.data.cmd) {
      case 'say_something':
        var result = 20 * 20;
        self.postMessage({
          result: result
        });
        break;
      default:
        self.postMessage({
          result: null
        });
    }
  }, 1000);
});
