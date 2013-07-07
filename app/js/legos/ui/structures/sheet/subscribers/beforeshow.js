/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _beforeshowIIFE(n$) {

   n$.sheets.subscribers.register('beforeshow',
         /**
          * Create a new render subscriber;
         */
        function (callBack) {
            'use strict';
            if (callBack) {
              //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-beforeshow

              /**
               * BeforeShow event on the window.Window
               * @param extView {Ext.Component} usually the Ext Window
               * @param eOpts {Object} arbitrary Ext props
              */
              return function (extView, eOpts) {
                  'use strict';
                  callBack.call(extView, extView, eOpts);
              };
          }
      });


}(window.$nameSpace$));
