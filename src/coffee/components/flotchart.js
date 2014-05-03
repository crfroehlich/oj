// Generated by CoffeeScript 1.7.1
(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-flotchart';
    className = 'flotchart';
    OJ.components.members[nodeName] = className;
    OJ.components.register(className, function(options, owner) {
      var cmpnt, defaults, ret;
      defaults = {
        config: {},
        data: [],
        props: {
          "class": 'flotchart'
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.component(defaults, owner, nodeName);
      cmpnt = ret.div(defaults);
      cmpnt.flot = $.plot(cmpnt.$, defaults.data, defaults.config);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=flotchart.map