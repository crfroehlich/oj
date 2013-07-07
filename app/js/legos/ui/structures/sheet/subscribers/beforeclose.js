/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _beforecloseIIFE(n$) {


    n$.sheets.subscribers.register('beforeclose',
        /**
          * Create a new before close subscriber;
         */
        function subscribers(callBack) {
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
