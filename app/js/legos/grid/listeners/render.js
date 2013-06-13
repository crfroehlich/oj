/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _renderIIFE(n$) {

    n$.grids.listeners.lift('render',
        /**
         * Create a new render listener;
        */
        function listeners(callBack) {
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.grid.Panel-event-render

              /**
               * Render event on the grid panel
               * @param extView {Ext.Component} usually the Ext Panel
               * @param eOpts {Object} arbitrary Ext props
              */
              return function render(extView, eOpts) {
                  callBack(extView, eOpts);
              };
          }
      });

}(window.$nameSpace$));
