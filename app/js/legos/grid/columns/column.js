/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _columnIIFE(n$) {

    /**
     * Ext xtypes constant. Possible values: 'checkcolumn', 'actioncolumn', 'gridcolumn'
    */
    var xtypes = n$.object();
    xtypes.checkcolumn = 'checkcolumn';
    xtypes.gridcolumn = 'gridcolumn';
    xtypes.actioncolumn = 'actioncolumn';
    n$.constant(n$.grids, 'xtypes', xtypes);


    /**
     * Private column constructor class
     * @param xtyle {n$.constants.xtype} [xtype=n$.grids.constants.xtypes.gridcolumn] The type of column
     * @param sortable {Boolean} [sortable=true] Is Column Sortable
     * @param text {String} Column name
     * @param flex {Number} [flex=0.125] relative Column width
     * @param menuDisabled {Boolean} [menuDisabled=false] Is Menu disabled?
     * @param dataIndex {String} [dataIndex=text] Unique Index Id for the column
     * @param editor {String} If the column is editable, type of editor
    */
    var Column = function (xtype, sortable, text, flex, menuDisabled, dataIndex, editor) {
        'use strict';
        var that = this;

        if(false === n$.grids.constants.xtypes.has(xtype)) {
            xtype = n$.grids.constants.xtypes.gridcolumn;
        }
        if(!text) {
           // throw new Error('Text is required for column construction.');
        }

        n$.property(that, 'xtype', xtype);
            
        if (sortable === true || sortable === false) {
            n$.property(that, 'sortable', sortable);
        }
        if (text && text !== '' ) {
            n$.property(that, 'text', text);
        }
        if (flex && flex !== 0) {
            n$.property(that, 'flex', flex);
        }
        if (menuDisabled === true || menuDisabled === false) {
            n$.property(that, 'menuDisabled', menuDisabled);
        }
        var idx = (dataIndex || text).toLowerCase();
        n$.property(that, 'dataIndex', idx);
        
        if(editor) {
            n$.property(that, 'editor', editor);
        }

        return that;
    };

    n$.instanceOf.lift('Column', Column);

    n$.grids.columns.lift('column',
        /**
         * Create a column definition.
         * @param def {Object} Possible property members: def.xtype, def.sortable, def.text, def.flex, def.menuDisabled, def.dataIndex, def.editor
        */
        function (def) {
        'use strict';
        if (!def) {
            throw new Error('Cannot create a column without parameters');
        }
        var ret = new Column(def.xtype, def.sortable, def.text, def.flex, def.menuDisabled, def.dataIndex, def.editor);
        return ret;
    });


}(window.$nameSpace$));
