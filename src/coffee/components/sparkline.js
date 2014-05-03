// Generated by CoffeeScript 1.7.1
(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-sparkline';
    className = 'sparkline';
    OJ.components.members[nodeName] = className;
    OJ.components.register(className, function(options, owner) {
      var cmpnt, defaults, ret;
      defaults = {
        config: {
          type: 'line',
          height: '70',
          width: '',
          enableTagOptions: true
        },
        data: [],
        props: {
          "class": 'sparkline'
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.component(defaults, owner, nodeName);
      cmpnt = ret.div(defaults);
      cmpnt.$.sparkline(defaults.data, defaults.config);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=sparkline.map
