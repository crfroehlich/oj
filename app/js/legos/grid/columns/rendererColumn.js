/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _gridColumnIIFE(){

    /**
     * Private renderer column class constructor. 
     * @param dataIndex {String} Column id
     * @param width {Number} [width] Absolute width of the column
     * @param flex {Number} [flex] Relative width of the column
     * @param onRender {Function} Render method for the column
    */
    var RendererColumn = function (dataIndex, width, flex, onRender) {
        var that = OJ.grids.columns.column({
                xtype: OJ.grids.constants.xtypes.gridcolumn,
                dataIndex: dataIndex
                //text: dataIndex
        });
        OJ.property(that, 'renderer', onRender);
        if (width && width > 0) {
            OJ.property(that, 'width', width);
        } else {
            if (flex && flex > 0) {
                OJ.property(that, 'flex', flex);
            }
        }

        return that;
    };

    OJ.instanceOf.lift('RendererColumn', RendererColumn);

    /**
     * Create a grid column
     * @param colDef {Object} Definition of the renderer column
    */
    OJ.grids.columns.lift('rendererColumn', function (colDef){
        if (!colDef || arguments.length === 0) {
            throw new Error('Cannot create a column without parameters');
        }
        if (!colDef.onRender) {
            throw new Error('Cannot create a render column without a render method.');
        }

        var ret = new RendererColumn(colDef.dataIndex, colDef.width, colDef.flex, colDef.onRender);
        
        return ret;
    });


    }());