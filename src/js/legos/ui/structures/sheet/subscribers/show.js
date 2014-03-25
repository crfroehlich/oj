/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _showIIFE(n$) {

    n$.sheets.subscribers.register('show',
         /**
          * Create a new show subscriber;
         */
        function subscribers(callBack) {
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-show

              /**
               * Show event on the tree panel
               * @param extView {Ext.Component} usually the Ext Window
               * @param eOpts {Object} arbitrary Ext props
              */
              return function show(extView, eOpts) {
                    //callBack.call(extView, extView, eOpts);
                    var args = arguments;
                    return n$.fun.apply(callBack, args, this);
              };
          }
      });


}(window.$nameSpace$));
