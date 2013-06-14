/// <reference path="~/Csw2/release/nsApp-vsdoc.js" />
/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _dropIIFE(n$) {

    n$.selections.subscribers.register('select',
        /**
         * Create a new render subscriber;
        */
        function subscribers(callBack) {
            if (callBack) {
                //http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.selection.CheckboxModel-event-select

                /**
                 * Event on selection
                 * @param thisRow {Ext.selection.RowModel} the row model
                 * @param dataModel {Ext.data.Model} the data model
                 * @param index {Number} the row index
                 * @param eOpts {Object} arbitrary Ext props
                */
                return function render(thisRow, dataModel, rowIndex, eOpts) {
                    callBack(thisRow, dataModel, rowIndex, eOpts);
                };
            }
        });


}(window.$nameSpace$));
