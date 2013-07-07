/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _bodyscrollIIFE(n$) {

    n$.grids.subscribers.register('bodyscroll',
        /**
         * Create a new bodyscroll subscriber;
        */
        function subscriber(callBack) {
            'use strict';
            if (callBack) {
              
              /**
               * Undocumented subscriber method
              */
              return function bodyscroll() {
                  var args = arguments;
                  callBack.call(this, args);
              };
          }
      });


}(window.$nameSpace$));
