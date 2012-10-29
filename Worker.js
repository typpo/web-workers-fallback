(function(window) {
  var WW_CONTEXT_WHITELIST = [
    'setTimeout', 'setInterval', 'XMLHttpRequest',
    'navigator', 'location', 'clearTimeout', 'clearInterval',
    'applicationCache', 'importScripts', 'Worker' /*, 'Blob'*/
  ];

  //if (typeof window.Worker !== 'undefined') return;
  window.Worker = function(worker_path) {
    var worker_loaded = false;

    // Allow main thread to specify event listeners
    var ui_listeners = {};
    this.addEventListener = function(event_name, fn) {
      // listen for events from worker thread
      if (!ui_listeners[event_name])
        ui_listeners[event_name] = [];
      ui_listeners[event_name].push(fn);
    }

    function WorkerContext() {
      var worker_listeners = {};
      // TODO support onmessage etc.
      this.addEventListener = function(event_name, fn) {
        // listen for events from UI thread
        if (!worker_listeners[event_name])
          worker_listeners[event_name] = [];
        worker_listeners[event_name].push(fn);
      }

      this.postMessage = function(msg) {
        triggerEvent(ui_listeners, 'message', msg);
      }

      this.__processPostMessage = function(msg) {
        triggerEvent(worker_listeners, 'message', msg);
      }

      this.close = function() {
        console.log("NYI");
      }
    }
    var worker_context = new WorkerContext();

    this.postMessage = function(msg) {
      waitForWorkerLoaded(function() {
        worker_context.__processPostMessage(msg);
      });
    }

    this.terminate = function() {
      console.log("NYI");
    }

    function triggerEvent(listeners_map, event_name, event_data) {
      var event_obj = {
        data: event_data
      }
      if (!listeners_map[event_name]) return;
      for (var i=0; i < listeners_map[event_name].length; i++) {
        listeners_map[event_name][i](event_obj);
      }
    }

    function waitForWorkerLoaded(callback) {
      (function poll() {
        if (worker_loaded) {
          callback();
          return;
        }
        setTimeout(poll, 50);
      })();
    }

    var req = window.XMLHttpRequest ?
      new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    if(req === null) {
      console.log("XMLHttpRequest failed to initiate.");
    }
    req.onload = function() {
      try {
        scopedEval.call(worker_context, req.responseText);
        worker_loaded = true;
      } catch(e) {
        console.log("JS error in worker file", e);
      }
    }
    try {
      req.open("GET", worker_path, true);
      req.send(null);
    } catch(e) {
      console.log("Error retrieving worker file", e);
    }
  }

  function scopedEval(scr) {
    var mask = {};

    // window context
    var allowed_globals = {};
    for (p in WW_CONTEXT_WHITELIST) {
      allowed_globals[WW_CONTEXT_WHITELIST[p]] = true;
    }
    for (p in window) {
      if (!allowed_globals[p]) {
        mask[p] = "[[ Can't use window context in web worker! ]]";
      }
    }
    // worker context
    for (p in this)
      mask[p] = this[p];
    // set self context
    mask['self'] = this;

    // execute script within scope
    (new Function( "with(this) { " + scr + "}")).call(mask);
  }
})(window);
