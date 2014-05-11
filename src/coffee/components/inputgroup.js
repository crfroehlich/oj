// Generated by CoffeeScript 1.7.1
(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-input-group';
    className = 'inputgroup';
    OJ.components.members[nodeName] = className;
    OJ.components.register(className, function(options, owner) {
      var cmpnt, defaults, input, label, ret;
      defaults = {
        props: {
          "class": 'form-group'
        },
        events: {
          change: _.noop
        },
        "for": OJ.createUUID(),
        labelText: '',
        inputType: 'text',
        placeholder: ''
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      cmpnt = ret.div({
        props: {
          "class": 'form-group'
        }
      });
      label = cmpnt.label({
        props: {
          "for": defaults["for"]
        },
        text: defaults.labelText
      });
      input = cmpnt.input({
        props: {
          id: defaults["for"],
          type: OJ.enums.inputTypes[defaults.inputType].name,
          "class": 'form-control',
          placeholder: defaults.placeholder
        }
      });
      ret.value = function() {
        return input.value;
      };
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=inputgroup.map
