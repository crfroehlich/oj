// Generated by CoffeeScript 1.7.1
(function() {
  var __slice = [].slice;

  (function(OJ) {
    'use strict';
    OJ.nodes.register('a', function(options, owner, calledFromFactory) {
      var click, defaults, newClick, ret, toggle;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          id: '',
          "class": '',
          text: '',
          href: '#',
          type: '',
          title: '',
          rel: '',
          media: '',
          target: ''
        },
        styles: {},
        events: {
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret.toggleState = 'off';
      toggle = function() {
        if (ret.toggleState === 'on') {
          ret.toggleState = 'off';
        } else {
          if (ret.toggleState === 'off') {
            ret.toggleState = 'on';
          }
        }
      };
      if (defaults.events.click !== _.noop) {
        click = defaults.events.click;
        newClick = function() {
          var event, ret;
          event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          toggle;
          ret = click.apply(null, event);
          if (defaults.href === '#') {
            return false;
          } else {
            return retval;
          }
        };
        defaults.events.click = newClick;
      } else {
        defaults.events.click = toggle;
      }
      ret = OJ.element('a', defaults.props, defaults.styles, defaults.events);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=a.map
