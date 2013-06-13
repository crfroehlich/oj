/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE() {

     /**
      * Create a new render listener;
     */
      OJ.trees.listeners.lift('afterrender', function (callBack){
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.tree.Panel-event-afterrender

              /**
               * AfterRender event on the tree panel
               * @param extView {Ext.Component} usually the Ext Panel
               * @param eOpts {Object} arbitrary Ext props
              */
              return function (extView, eOpts) {
                  callBack(extView, eOpts);
              };
          }
      });


      }());