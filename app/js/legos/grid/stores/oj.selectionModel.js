/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _selectionModelClassIIFE() {

    var gridSelectionMode = Object.create(null);
    gridSelectionMode.simple = 'SIMPLE';
    gridSelectionMode.single = 'SINGLE';
    gridSelectionMode.multi = 'MULTI';
    OJ.constant(OJ.grids, 'selectionMode', gridSelectionMode);
    
    /**
     * Internal class to define a Proxy. This class cannot be directly instanced.
     */
    var SelectionModel = function(mode, checkOnly, onSelect, onDeselect) {
        if (!(OJ.grids.constants.selectionMode.has(mode))) {
            throw new Error('Grid selection model does not support mode "' + mode + '".');
        }
        var that = this;
        OJ.property(that, 'mode', mode);
        OJ.property(that, 'checkOnly', checkOnly);

        //Until we need more listeners on the Selection Model, let's define them ad hoc.
        //This'll be right until it isn't.
        if (onSelect || onDeselect) {
            OJ.property(that, 'listeners', {});
            if (onSelect) {
                OJ.property(that.listeners, 'select', onSelect);
            }
            if (onDeselect) {
                OJ.property(that.listeners, 'deselect', onDeselect);
            }
        }

        OJ.property(that, 'ExtSelModel', Ext.create('Ext.selection.CheckboxModel', that));

        return that;
    };

    OJ.instanceOf.lift('SelectionModel', SelectionModel);

    /**
     * Instance a new Selection Model. Selection Models are the constraints upon which elements from grids can be selected.
     * @param selDef {Object} Object describing the model
     */
    OJ.stores.lift('selectionModel', function(selDef) {
        if (!selDef) {
            throw new Error('Cannot create a selection model without a definition.');
        }
        selDef.mode = selDef.mode || OJ.grids.constants.selectionMode.simple;
        var ret = new SelectionModel(selDef.mode, selDef.checkOnly, selDef.onSelect, selDef.onDeselect);
        
        return ret;
    });

}());