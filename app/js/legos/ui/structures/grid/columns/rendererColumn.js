/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _gridColumnIIFE(n$) {

    /**
     * Private renderer column class constructor. 
     * @param dataIndex {String} Column id
     * @param width {Number} [width] Absolute width of the column
     * @param flex {Number} [flex] Relative width of the column
     * @param onRender {Function} Render method for the column
    */
    var RendererColumn = function (dataIndex, width, flex, onRender) {
        'use strict';
        var that = n$.grids.columns.column({
            xtype: n$.grids.constants.xtypes.gridcolumn,
            dataIndex: dataIndex
            //text: dataIndex
        });
        n$.property(that, 'renderer', onRender);
        if (width && width > 0) {
            n$.property(that, 'width', width);
        } else {
            if (flex && flex > 0) {
                n$.property(that, 'flex', flex);
            }
        }

        return that;
    };

    n$.instanceOf.register('RendererColumn', RendererColumn);

    n$.grids.columns.register('rendererColumn',
        /**
         * Create a grid column which renders as the result of a callback
         * @param colDef {Object} Definition of the renderer column
        */
        function rendererColumn(colDef) {
            'use strict';
            if (!colDef || arguments.length === 0) {
                throw new Error('Cannot create a column without parameters');
            }
            if (!colDef.onRender) {
                throw new Error('Cannot create a render column without a render method.');
            }

            var ret = new RendererColumn(colDef.dataIndex, colDef.width, colDef.flex, colDef.onRender);

            return ret;
        });


}(window.$nameSpace$));
