(function() {
  (function(OJ) {
    'use strict';    OJ.nodes.register('fieldset', function(options, owner, calledFromFactory) {
      var defaults, ret;

      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          form: '',
          disabled: '',
          name: ''
        },
        styles: {},
        events: {
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('fieldset', defaults.props, defaults.styles, defaults.events);
      if (owner) {
        owner.append(ret);
      }
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);
//@ sourceMappingURL=fieldset.js.map