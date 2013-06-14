/// <reference path="~/Csw2/release/nsApp-vsdoc.js" />
/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _listenerIIFE(n$) {

    //init the namespace
    n$.dataSelections.makeSubNameSpace('subscribers');

    /**
     * Define the subscriber methods which are available to this class.
    */
    var selectionModelSubsribeables = n$.object();
    selectionModelSubsribeables.select = 'select';
    selectionModelSubsribeables.deselect = 'deselect';

    n$.constant(n$.dataSelections, 'subscribers', selectionModelSubsribeables);

    n$.dataSelections.subscribers.register('subscribers',
        /**
         * Create a new subscribers collection. This returns a subscribers object with an add method.
        */
        function subscribers() {
            var ret = n$.makeSubscribers('selectionsSubscribers', 'selections');
            return ret;
        });


}(window.$nameSpace$));
