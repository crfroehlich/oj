/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _listenerIIFE() {

    /**
     * Define the listener methods which are available to this class.
    */
    var windowListeners = OJ.object();
    windowListeners.add('beforeclose', 'beforeclose');
    windowListeners.add('beforeshow', 'beforeshow');
    windowListeners.add('show', 'show');
    OJ.constant(OJ.okna, 'listeners', windowListeners);
    
    /**
     * Create a new listeners collection. This returns a listeners object with an add method.
    */
    OJ.okna.listeners.lift('listeners', function () {
        var ret = OJ.makeListeners('windowListeners', 'okna');
        return ret;
    });


}());