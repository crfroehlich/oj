/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE(n$) {

    n$.panels.listeners.lift('afterlayout',
        /**
          * Create a new afterlayout listener;
         */
        function listeners(callBack) {
        'use strict';
        if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.panel.Panel-event-afterlayout
              
              /**
               * Returns a callback wrapper with the Ext arguments for afterlayout
               * @param viewEl {Ext.Component} Usually the Panel object
               * @param layout {Ext.layout.container.Container} The container object
               * @param eOpts {Object} arbitrary Ext object
              */
              return function afterlayout(viewEl, layout, eOpts) {
                  'use strict';
                  callBack(viewEl, layout, eOpts);
              };
          }
      });


}(window.$nameSpace$));
