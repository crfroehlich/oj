/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the listener methods which are available to this class.
    */
    var panelListeners = n$.object();
    panelListeners.afterlayout = 'afterlayout';
    n$.constant(n$.panels, 'listeners', panelListeners);


    n$.panels.listeners.lift('listeners',
        /**
         * Create a new listeners collection. This returns a listeners object with an add method.
        */
        function panellisteners() {
            'use strict';
            var ret = n$.makeListeners('panelListeners', 'panels');
            return ret;
        });
    

}(window.$nameSpace$));
