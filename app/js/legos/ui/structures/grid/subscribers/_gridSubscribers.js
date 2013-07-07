/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the subscriber methods which are available to this class.
    */
    var gridSubscribeableEvents = n$.object();
    gridSubscribeableEvents.render = 'render';
    gridSubscribeableEvents.drop = 'drop';
    gridSubscribeableEvents.bodyscroll = 'bodyscroll';

    n$.constant(n$.grids, 'subscribers', gridSubscribeableEvents);

    n$.grids.subscribers.register('subscribers',
        /**
         * Create a new subscribers collection. This returns a subscribers object with an add method.
        */
        function subscribers() {
            var ret = n$.makeSubscribers('gridSubscribers', 'grids');
            return ret;
        });


}(window.$nameSpace$));
