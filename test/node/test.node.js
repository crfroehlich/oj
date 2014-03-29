(function() {
  (function(OJ) {
    module(OJ.name + "node");
    test(OJ.name + ".node.make(" + OJ.name + "'TestingDiv')", function() {
      var node;

      expect(3);
      node = OJ.nodes.div();
      deepEqual(node.tagName === "DIV", true, OJ.name + " Node is a DIV");
    });
    test(OJ.name + " test child node", function() {
      var childDiv, node;

      expect(3);
      node = OJ.nodes.div();
      childDiv = node.div();
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);
//@ sourceMappingURL=test.node.js.map