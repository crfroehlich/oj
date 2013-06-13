/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the listener methods which are available to this class.
    */
    var gridListeners = n$.object();
    gridListeners.render = 'render';
    gridListeners.drop = 'drop';
    gridListeners.bodyscroll = 'bodyscroll';

    n$.constant(n$.grids, 'listeners', gridListeners);

    n$.grids.listeners.lift('listeners',
        /**
         * Create a new listeners collection. This returns a listeners object with an add method.
        */
        function listeners() {
            var ret = n$.makeListeners('gridListeners', 'grids');
            return ret;
        });


}(window.$nameSpace$));
