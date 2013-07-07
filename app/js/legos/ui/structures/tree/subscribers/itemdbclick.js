/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _itemdbclickIIFE(n$) {

    
    n$.trees.subscribers.register('itemdblclick',
         /**
          * Create a new render subscriber;
         */
        function subscribers(callBack) {
            'use strict';
            if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.tree.Panel-event-itemdblclick

              /**
               * AfterRender event on the tree panel
               * @param extView {Ext.Component} usually the Ext Panel
               * @param record {Ext.data.Model} The record object
               * @param item {HTMLElement} The DOM node
               * @param e {Ext.EventObject} The event object
               * @param eOpts {Object} arbitrary Ext props
              */
              return function itemdblclick(extView, record, item, index, e, eOpts) {
                  'use strict';
                  callBack(extView, record, item, index, e, eOpts);
              };
          }
      });


}(window.$nameSpace$));
