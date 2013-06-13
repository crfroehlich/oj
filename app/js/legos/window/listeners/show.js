/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _showIIFE(n$) {

    n$.okna.listeners.lift('show',
         /**
          * Create a new show listener;
         */
        function listeners(callBack) {
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-show

              /**
               * Show event on the tree panel
               * @param extView {Ext.Component} usually the Ext Window
               * @param eOpts {Object} arbitrary Ext props
              */
              return function show(extView, eOpts) {
                  callBack.call(extView, extView, eOpts);
              };
          }
      });


}(window.$nameSpace$));
