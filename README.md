A very basic fallback for basic html5 web worker api compatibility in browsers that don't support them.

Limitations:
- No support for infinite loops in workers
- No support for close/terminate

TODO:
- error handlers
- onmessage, onerror, etc. events
- infinite loop support
- terminate/close support
