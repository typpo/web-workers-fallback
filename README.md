Overview
---

This library provides basic compatibility for the html5 web worker api in browsers that don't support it.  Ideally, usage is as simple as including Worker.js, and everything should work out of the box.  In practice, you should read the Limitations section and test in a browser that doesn't support web workers.

This was developed for [Asterank](http://www.asterank.com/3d), where it is used so people with underpowered browsers can still enjoy the physics simulations.

Limitations
---

**No support for infinite loops in workers**

You'll have to change infinite loops in your workers to something like:

```
(function loop() {
  // do work
  setTimeout(loop, 60);
});
```

Or, experimentally, use the `doEvents` method exposed in the worker context:

```
while (true) {
  // do work
  self.doEvents();
}
```

**No support for close/terminate**

`worker.close()` or `self.terminate()` have no effect, as the workers aren't actually running on separate threads (so there is nothing to terminate).  Instead, I recommend having your worker listen for a shutdown message that causes it to stop doing work.

To do
---
- error handlers
- onerror, etc. events
- terminate/close support
