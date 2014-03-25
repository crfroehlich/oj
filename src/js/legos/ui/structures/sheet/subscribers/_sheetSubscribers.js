/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    /**
     * Define the subscriber methods which are available to this class.
    */
    var sheetSubscribers = n$.object();
    sheetSubscribers.add('beforeclose', 'beforeclose');
    sheetSubscribers.add('beforeshow', 'beforeshow');
    sheetSubscribers.add('show', 'show');
    n$.constant(n$.sheets, 'subscribers', sheetSubscribers);

    n$.sheets.subscribers.register('subscribers',
        /**
         * Create a new subscribers collection. This returns a subscribers object with an add method.
        */
        function subscribers() {
            'use strict';
            var ret = n$.makeSubscribers('sheetSubscribers', 'sheets');
            return ret;
        });


}(window.$nameSpace$));
