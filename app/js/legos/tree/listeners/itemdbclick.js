/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE() {

     /**
      * Create a new render listener;
     */
    OJ.trees.listeners.lift('itemdblclick', function (callBack) {
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
              return function (extView, record, item, index, e, eOpts) {
                  callBack(extView, record, item, index, e, eOpts);
              };
          }
      });


      }());