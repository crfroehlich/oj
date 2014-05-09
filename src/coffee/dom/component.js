// Generated by CoffeeScript 1.7.1
(function() {
  (function(OJ) {

    /*
    Create an HTML Element through ThinDom
     */
    var component;
    component = function(options, owner, tagName) {
      var ret, rootNodeType, widget;
      if (options == null) {
        options = OJ.object();
      }
      if (!tagName.startsWith('x-')) {
        tagName = 'x-' + tagName;
      }
      widget = OJ.element(tagName);
      OJ.nodes.factory(widget, owner);
      rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
      ret = widget[rootNodeType](options);
      ret.add('componentName', tagName);
      ret.add('remove', widget.remove);
      return ret;
    };
    OJ.register('component', component);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=component.map
