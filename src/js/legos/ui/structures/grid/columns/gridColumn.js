/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _gridColumnIIFE(n$) {

    /**
     * Private grid column class constructor
     * @param text {String} Column Name
     * @param editor {String} If column is editable, the type of editor
     * @param flex {Number} [flex=0.125] Relative width of the column
    */
    var GridColumn = function (text, editor, flex) {
        'use strict';
        var that = n$.grids.columns.column({
            xtype: n$.grids.constants.xtypes.gridcolumn,
            flex: flex || 0.125,
            editor: editor,
            text: text
        });

        return that;
    };

    n$.instanceOf.register('GridColumn', GridColumn);

    n$.grids.columns.register('gridColumn',
        /**
         * Create a grid column
         * @param sortable {Boolean} [sortable=true] Is Column Sortable
         * @param text {String} Column Name
         * @param menuDisabled {Boolean} [menuDisabled=false] Is Menu Disabled
         * @param flex {Number} [flex=0.125] Relative width of the column
         * @param editor {String} If column is editable, the type of editor
        */
        function gridColumn(sortable, text, menuDisabled, flex, editor) {
            'use strict';
            if (arguments.length === 0) {
                throw new Error('Cannot create a column without parameters');
            }

            var ret = new GridColumn(text, editor, flex);
            ret.menuDisabled = menuDisabled;
            ret.sortable = sortable;
            return ret;
        });


}(window.$nameSpace$));
