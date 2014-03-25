/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the subscriber methods which are available to this class.
    */
    var panelSubscribers = n$.object();
    panelSubscribers.afterlayout = 'afterlayout';
    n$.constant(n$.panels, 'subscribers', panelSubscribers);


    n$.panels.subscribers.register('subscribers',
        /**
         * Create a new subscribers collection. This returns a subscribers object with an add method.
        */
        function panellisteners() {
            'use strict';
            var ret = n$.makeSubscribers('panelSubscribers', 'panels');
            return ret;
        });
    

}(window.$nameSpace$));
