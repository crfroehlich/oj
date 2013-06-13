/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE(n$) {
    
    n$.trees.listeners.lift('afterrender',
        /**
          * Create a new render listener;
         */
        function listeners(callBack) {
          'use strict';
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.tree.Panel-event-afterrender

              /**
               * AfterRender event on the tree panel
               * @param extView {Ext.Component} usually the Ext Panel
               * @param eOpts {Object} arbitrary Ext props
              */
              return function afterrender(extView, eOpts) {
                  'use strict';
                  callBack(extView, eOpts);
              };
          }
      });


}(window.$nameSpace$));
