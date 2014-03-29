(function() {
  (function(OJ) {
    OJ.makeSubNameSpace("errors");
    /*
    To check assigned type
    */

    OJ.makeSubNameSpace("is");
    /*
    To instance check classes
    */

    OJ.makeSubNameSpace("instanceOf");
    /*
    Type conversion
    */

    OJ.makeSubNameSpace("to");
    return OJ.makeSubNameSpace("nodes");
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);
//@ sourceMappingURL=ojInit.js.map