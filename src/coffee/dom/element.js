// Generated by CoffeeScript 1.7.1
(function() {
  var __slice = [].slice;

  (function(OJ) {

    /*
     Bind all event handlers
     */
    var bindEvents, body, finalize, initBody, thinBody;
    bindEvents = function(el, events) {
      if (el) {
        return _.forOwn(events, function(val, key) {
          var callback;
          if (_.isFunction(val && val !== _.noop)) {
            callback = function() {
              var event;
              event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return val.apply(null, event);
            };
            el.$.bind(key, callback);
            el.add(key, callback);
          }
        });
      }
    };

    /*
    Finalize the ThimDOM node
     */
    finalize = function(ret, tag, props, styles, events) {
      ret.add('tagName', tag);
      ret.css(styles);
      ret.add('$', $(ret.get()));
      ret.add('0', ret.get());
      bindEvents(ret, events);
      return ret;
    };

    /*
    Create an HTML Element through ThinDom
     */
    OJ.register('element', function(tag, props, styles, events) {
      var ret;
      ret = ThinDOM(tag, props);
      finalize(ret, tag, props, styles, events);
      return ret;
    });

    /*
    Restore an HTML Element through ThinDom
     */
    OJ.register('restoreElement', function(tag, el) {
      var ret;
      ret = ThinDOM(null, null, el);
      finalize(ret, tag);
      ret.add('isInDOM', true);
      return ret;
    });

    /*
    Persist a handle on the body ode
     */
    if (typeof document !== 'undefined') {
      body = document.body;
    } else {
      body = null;
    }
    initBody = function(el) {
      var ret;
      ret = ThinDOM(null, {
        id: 'body'
      }, el);
      ret.isInDOM = true;
      return finalize(ret, 'body');
    };
    thinBody = initBody(body);
    thinBody.getId = function() {
      return 'body';
    };
    OJ.register('body', thinBody);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=element.map
