/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the subscriber methods which are available to this class.
    */
    var treeSubscribers = Object.create(null);
    treeSubscribers.afterrender = 'afterrender';
    treeSubscribers.itemdblclick = 'itemdblclick';

    n$.constant(n$.trees, 'subscribers', treeSubscribers);

    n$.trees.subscribers.register('subscribers',
        /**
         * Create a new subscribers collection. This returns a subscribers object with an add method.
        */
        function subscribers() {
            'use strict';
            var ret = n$.makeSubscribers('treeSubscribers', 'trees');
            return ret;
        });


}(window.$nameSpace$));
