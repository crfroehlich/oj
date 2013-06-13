/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _afterrenderIIFE() {

     /**
      * Create a new render listener;
     */
      OJ.okna.listeners.lift('beforeshow', function (callBack){
          if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-beforeshow

              /**
               * BeforeShow event on the window.Window
               * @param extView {Ext.Component} usually the Ext Window
               * @param eOpts {Object} arbitrary Ext props
              */
              return function (extView, eOpts) {
                  callBack.call(extView, extView, eOpts);
              };
          }
      });


      }());