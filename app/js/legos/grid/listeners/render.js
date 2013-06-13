/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _renderIIFE() {

     /**
      * Create a new render listener;
     */
      OJ.grids.listeners.lift('render', function (callBack){
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.grid.Panel-event-render

              /**
               * Render event on the grid panel
               * @param extView {Ext.Component} usually the Ext Panel
               * @param eOpts {Object} arbitrary Ext props
              */
              return function (extView, eOpts) {
                  callBack(extView, eOpts);
              };
          }
      });


      }());