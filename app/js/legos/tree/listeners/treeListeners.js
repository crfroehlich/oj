/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the listener methods which are available to this class.
    */
    var treeListeners = Object.create(null);
    treeListeners.afterrender = 'afterrender';
    treeListeners.itemdblclick = 'itemdblclick';

    n$.constant(n$.trees, 'listeners', treeListeners);

    n$.trees.listeners.lift('listeners',
        /**
         * Create a new listeners collection. This returns a listeners object with an add method.
        */
        function listeners() {
            'use strict';
            var ret = n$.makeListeners('treeListeners', 'trees');
            return ret;
        });


}(window.$nameSpace$));
