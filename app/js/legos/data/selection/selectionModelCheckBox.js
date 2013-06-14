/// <reference path="../release/nsApp-vsdoc.js" />
/** jshint undef: true, unused: true */
/** global n$:true, window:true, Ext:true, $: true */

(function _selectionModelClassIIFE(n$) {

    /**
     * Internal class to define a CheckBox Selection Mode. This class cannot be directly instanced.
    * @param name {String} A name for the store class
    * @param mode {String} [mode=SIMPLE] The selection mode (SIMPLE; SINGLE; MULTI)
    * @param onDefine {Function} [onDefine] An optional callback on init
    */
    var CheckBoxSelectionModel = function(name, mode, checkOnly, onDefine) {
        if (!(n$.selections.constants.selectionMode.has(mode))) {
            throw new Error('Selection models do not support mode "' + mode + '".');
        }
        var that = n$.selections.selectionModel({
            name: name,
            mode: mode,
            onDefine: function (classDef) {
                delete classDef.initComponent;
                n$.property(classDef, 'checkOnly', checkOnly);
                if (onDefine) {
                    onDefine(classDef, that);
                }
                //return window.Ext.create('Ext.selection.CheckboxModel', classDef);
            }
        });

        return that;
    };

    n$.instanceOf.register('CheckBoxSelectionModel', CheckBoxSelectionModel);

    /**
     * Instance a new Selection Model. Selection Models are the constraints upon which elements from grids can be selected.
     * @param selDef {Object} Object describing the model
     */
    n$.selections.register('selectionModelCheckBox', function (selDef) {
        if (!selDef) {
            throw new Error('Cannot create a selection model without a definition.');
        }
        selDef.mode = selDef.mode || n$.selections.constants.selectionMode.simple;
        var ret = new CheckBoxSelectionModel(selDef.name, selDef.mode, selDef.checkOnly, selDef.onDefine);
        ret.init();
        return ret;
    });

}(window.$nameSpace$));
