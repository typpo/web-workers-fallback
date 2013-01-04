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

License (MIT)
---
web-workers-fallback
Copyright (C) 2012 by Ian Webster

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
