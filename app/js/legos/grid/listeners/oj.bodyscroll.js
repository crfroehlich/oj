/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _bodyscrollIIFE() {

     /**
      * Create a new bodyscroll listener;
     */
      OJ.grids.listeners.lift('bodyscroll', function (callBack){
          if (callBack) {
             
              /**
               * Undocumented listener method
              */
              return function () {
                  callBack();
              };
          }
      });


      }());