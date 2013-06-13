/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the listener methods which are available to this class.
    */
    var windowListeners = n$.object();
    windowListeners.add('beforeclose', 'beforeclose');
    windowListeners.add('beforeshow', 'beforeshow');
    windowListeners.add('show', 'show');
    n$.constant(n$.okna, 'listeners', windowListeners);

    n$.okna.listeners.lift('listeners',
        /**
         * Create a new listeners collection. This returns a listeners object with an add method.
        */
        function listeners() {
            'use strict';
            var ret = n$.makeListeners('windowListeners', 'okna');
            return ret;
        });


}(window.$nameSpace$));
