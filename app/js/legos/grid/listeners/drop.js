/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _dropIIFE(n$) {

    n$.grids.listeners.lift('drop',
        /**
          * Create a new drop listener;
         */
        function listener(callBack) {
            'use strict';
            if (callBack) {
                //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.grid.plugin.DragDrop-event-drop

                /**
                 * Returns a callback wrapper with the Ext arguments for drop
                 * @param node {HTMLElement} the Ext node over which the mouse was positioned
                 * @param data {Object} the associated data object. Has properties: copy, view, ddel, item, records
                 * @param overModel {Ext.data.Model} the Model where the event fired
                 * @param dropPosition {String} 'before' or 'after', depending on mouse position
                 * @param eOpts {Object} arbitrary Ext object
                */
                return function drop(node, data, overModel, dropPosition, eOpts) {
                    'use strict';
                    callBack(node, data, overModel, dropPosition, eOpts);
                };
            }
        });


}(window.$nameSpace$));
