/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _listenerIIFE() {

    /**
     * Define the listener methods which are available to this class.
    */
    var treeListeners = Object.create(null);
    treeListeners.afterrender = 'afterrender';
    treeListeners.itemdblclick = 'itemdblclick';

    OJ.constant(OJ.trees, 'listeners', treeListeners);
    
    /**
     * Create a new listeners collection. This returns a listeners object with an add method.
    */
    OJ.trees.listeners.lift('listeners', function () {
        var ret = OJ.makeListeners('treeListeners', 'trees');
        return ret;
    });


}());