(function() {
  (function(OJ) {
    'use strict';    OJ.nodes.register('form', function(options, owner, calledFromFactory) {
      var defaults, ret;

      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          action: '',
          method: '',
          name: ''
        },
        styles: {},
        events: {
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('form', defaults.props, defaults.styles, defaults.events);
      ret.add('validator', ret.$.validate({
        highlight: function(element) {
          var $elm;

          $elm = $(element);
          $elm.attr('OJ_invalid', '1');
          $elm.animate({
            backgroundColor: 'red'
          });
        },
        unhighlight: function(element) {
          var $elm;

          $elm = $(element);
          if ($elm.attr('OJ_invalid') === '1') {
            $elm.css('background-color', 'yellow');
            $elm.attr('OJ_invalid', '0');
            setTimeout((function() {
              $elm.animate({
                backgroundColor: 'transparent'
              });
            }), 500);
          }
        }
      }));
      ret.add('isFormValid', function() {
        return ret.$.valid() && (!ret.validator.invalidElements() || ret.validator.invalidElements().length === 0);
      });
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
//@ sourceMappingURL=form.js.map