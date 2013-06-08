/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _listenerIIFE() {

    /**
     * Define the listener methods which are available to this class.
    */
    var gridListeners = Object.create(null);
    gridListeners.render = 'render';
    gridListeners.drop = 'drop';
    gridListeners.bodyscroll = 'bodyscroll';

    OJ.constant(OJ.grids, 'listeners', gridListeners);
    
    /**
     * Create a new listeners collection. This returns a listeners object with an add method.
    */
    OJ.grids.listeners.lift('listeners', function () {
        var ret = OJ.makeListeners('gridListeners', 'grids');
        return ret;
    });


}());