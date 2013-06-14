/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _checkColumnIIFE(n$) {

    /**
     * Internal check column class
     * @param text {String} Name of the column
    */
    var CheckColumn = function (text) {
        'use strict';
        var that = n$.grids.columns.column({
            xtype: n$.grids.constants.xtypes.checkcolumn,
            flex: 0.075,
            text: text
        });
        that.align = 'center';

        return that;
    };

    n$.instanceOf.register('CheckColumn', CheckColumn);

    n$.grids.columns.register('checkColumn',
            /**
         * Create a check column
         * @param sortable {Boolean} [sortable=true] Is Column Sortable
         * @param text {String} Column Name
         * @param menuDisabled {Boolean} [menuDisabled=false] Is Menu Disabled
        */
        function checkColumn(sortable, text, menuDisabled) {
            'use strict';
            if (arguments.length === 0) {
                throw new Error('Cannot create a column without parameters');
            }

            var ret = new CheckColumn(text);
            ret.menuDisabled = menuDisabled;
            ret.sortable = sortable;

            return ret;
        });


}(window.$nameSpace$));
