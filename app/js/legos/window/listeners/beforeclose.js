/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _beforecloseIIFE(n$) {


    n$.okna.listeners.lift('beforeclose',
        /**
          * Create a new before close listener;
         */
        function listeners(callBack) {
            'use strict';
            if (callBack) {
                //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-beforeclose

                /**
                 * BeforeClose event on the window.Window
                 * @param extView {Ext.Component} usually the Ext Window
                 * @param eOpts {Object} arbitrary Ext props
                */
                return function beforeclose(extView, eOpts) {
                    'use strict';
                    callBack.call(extView, extView, eOpts);
                };
            }
        });


}(window.$nameSpace$));
