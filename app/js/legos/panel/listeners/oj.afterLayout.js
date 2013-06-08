/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE() {

     /**
      * Create a new afterlayout listener;
     */
    OJ.panels.listeners.lift('afterlayout', function (callBack){
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.panel.Panel-event-afterlayout
              
              /**
               * Returns a callback wrapper with the Ext arguments for afterlayout
               * @param viewEl {Ext.Component} Usually the Panel object
               * @param layout {Ext.layout.container.Container} The container object
               * @param eOpts {Object} arbitrary Ext object
              */
              return function (viewEl, layout, eOpts) {
                  callBack(viewEl, layout, eOpts);
              };
          }
      });


      }());