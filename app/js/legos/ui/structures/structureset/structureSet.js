/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _treelIIFE(n$) {

    n$.structureSets.register('structureSet',
        /**
         * Create a window (sheet) object.
         * @param setDef.name {String} The ClassName of the structure set to associate with ExtJS
         * @param setDef.scope {String} Classname subscope
         * @param setDef.autoCreateViewport {Boolean} [autoCreateViewport=false] 
         * @param setDef.onInit {Function} [onInit] Optional callback to be applied on construction 
        */
        function ssetfunc(setDef) {
            'use strict';
            return n$.structureSets._structureSet(setDef);
        });


}(window.$nameSpace$));
