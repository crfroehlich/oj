/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _treelIIFE(n$) {

    /**
     * Define the properties which are available to Grid.
    */
    var sheetProperties = n$.object();
    sheetProperties.add('minWidth', 'minWidth');
    sheetProperties.add('cascadeOnFirstShow', 'cascadeOnFirstShow');
    sheetProperties.add('height', 'height');
    sheetProperties.add('width', 'width');
    sheetProperties.add('shadowSprite', 'shadowSprite');
    sheetProperties.add('layout', 'layout');
    sheetProperties.add('closable', 'closable');
    sheetProperties.add('connection', 'connection');
    sheetProperties.add('items', 'items');
    sheetProperties.add('title', 'title');
    n$.constant(n$.sheets, 'properties', sheetProperties);

    /**
     * Private class representing the construnction of a window (sheet). It returns a n$.sheets.sheet instance with collections for adding subscribers.
     * @param name {String} The ClassName of the window (sheet) to associate with ExtJS
     * @param requires {Array} An array of ExtJS dependencies
     * @param extend {String} [extend='Ext.window.Window'] An ExtJs class name to extend, usually the window Window
     * @param alias {Array} [alias] An array of aliases to reference the window (sheet)
     * @param id {String} An id to uniquely identify the window (sheet)
     * @param store {n$.stores.store} A store to provide data to the window (sheet)
     * @param plugins {Array} An array of plugins to load with the window (sheet)
     * @param onInit {Function} [onInit] Optional callback to be applied on construction
    */
    var Sheet = function (name, requires, extend, alias, id, store, plugins, onInit) {
        'use strict';
        var that = n$.classDefinition({
            name: name,
            requires: requires,
            extend: extend || 'Ext.window.Window',
            alias: alias,
            id: id,
            store: store,
            plugins: plugins,
            constant: 'windowProperties',
            namespace: 'sheets'
        });
        if (onInit) {
            that.addInitComponent(function (them) {
                onInit(them);
            });
        }
        return that;
    };

    n$.instanceOf.register('Sheet', Sheet);

    n$.sheets.register('sheet',
        /**
         * Create a window (sheet) object.
         * @param sheetDef.treeName {String} The ClassName of the window (sheet) to associate with ExtJS
         * @param sheetDef.requires {Array} An array of ExtJS dependencies
         * @param sheetDef.extend {String} [extend='Ext.window.Window'] An ExtJs class name to extend, usually the window Window
         * @param sheetDef.alias {Array} [alias] An array of aliases to reference the window (sheet)
         * @param sheetDef.id {String} An id to uniquely identify the window (sheet)
         * @param sheetDef.store {n$.trees.stores.store} A store to provide data to the window (sheet)
         * @param sheetDef.plugins {Array} An array of plugins to load with the window (sheet)
         * @param sheetDef.onInit {Function} [onInit] Optional callback to be applied on construction
         * @returns {Csw.trees.sheet} A sheet object. Exposese subscribers and columns collections. Call init when ready to construct the sheet. 
        */
        function sheetfunc(sheetDef) {
            'use strict';
            if (!(sheetDef)) {
                throw new Error('Cannot instance a window (sheet) without properties');
            }
            if (!(sheetDef.name) && !(sheetDef.id)) {
                throw new Error('Cannot instance a window (sheet) without a classname');
            }
            var sheet = new Sheet(sheetDef.name, sheetDef.requires, sheetDef.extend, sheetDef.alias, sheetDef.id, sheetDef.store, sheetDef.plugins, sheetDef.onInit);
            return sheet;
        });


}(window.$nameSpace$));
