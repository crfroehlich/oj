/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE() {

     /**
      * Create a new before close listener;
     */
      OJ.okna.listeners.lift('beforeclose', function (callBack){
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-beforeclose

              /**
               * BeforeClose event on the window.Window
               * @param extView {Ext.Component} usually the Ext Window
               * @param eOpts {Object} arbitrary Ext props
              */
              return function (extView, eOpts) {
                  callBack.call(extView, extView, eOpts);
              };
          }
      });


      }());