/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _listenerIIFE() {

    /**
     * Define the listener methods which are available to this class.
    */
    var panelListeners = Object.create(null);
    panelListeners.afterlayout = 'afterlayout';

    OJ.constant(OJ.panels, 'listeners', panelListeners);

    /**
     * Create a new listeners collection. This returns a listeners object with an add method.
    */
    OJ.panels.listeners.lift('listeners', function () {
        var ret = OJ.makeListeners('panelListeners', 'panels');
        return ret;
    });



}());