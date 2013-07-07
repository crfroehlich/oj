/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _gridIIFE(n$) {

    /**
     * Define the properties which are available to Grid.
    */
    var gridProperties = n$.object();
    gridProperties.columnLines = 'columnLines';
    gridProperties.border = 'border';
    gridProperties.hideHeaders = 'hideHeaders';
    gridProperties.selModel = 'selModel';
    n$.constant(n$.grids, 'properties', gridProperties);

    /**
     * Private class representing the construnction of a grid. It returns a n$.grid.grid instance with collections for adding columns and subscribers.
     * @param name {String} The ClassName of the grid to associate with ExtJS
     * @param requires {Array} An array of ExtJS dependencies
     * @param extend {String} [extend='Ext.grid.Panel'] An ExtJs class name to extend, usually the grid panel
     * @param alias {Array} [alias] An array of aliases to reference the grid
     * @param id {String} An id to uniquely identify the grid
     * @param store {n$.stores.store} A store to provide data to the grid
     * @param plugins {Array} An array of plugins to load with the grid
     * @param columnLines {Boolean} 
     * @param onInit {Function} [onInit] Optional callback to be applied on construction
    */
    var Grid = function (name, requires, extend, alias, id, store, plugins, columnLines, onInit) {
        'use strict';
        var that = n$.classDefinition({
            name: name,
            requires: requires,
            extend: extend || 'Ext.grid.Panel',
            alias: alias,
            id: id,
            store: store,
            plugins: plugins,
            constant: 'gridProperties',
            namespace: 'grids',
            onDefine: function (classDef) {
                n$.property(classDef, 'columns', columns.value);
            }
        });

        if (columnLines === true || columnLines === false) {
            n$.property(that, n$.grids.constants.properties.columnLines, columnLines);
        }

        if (onInit) {
            that.addInitComponent(function (them) {
                onInit(them);
            });
        }

        var columns = n$.grids.columns.columns();
        n$.property(that, 'columnCollection', columns, false, false, false);

        return that;
    };

    n$.instanceOf.register('Grid', Grid);

    n$.grids.register('grid',
        /**
         * Create a grid object.
         * @returns {Csw.grids.grid} A grid object. Exposese subscribers and columns collections. Call init when ready to construct the grid. 
        */
        function gridFunc(gridDef) {
            'use strict';
            if (!(gridDef)) {
                throw new Error('Cannot instance a Grid without properties');
            }
            if (!(gridDef.name)) {
                throw new Error('Cannot instance a Grid without a classname');
            }
            var grid = new Grid(gridDef.name, gridDef.requires, gridDef.extend, gridDef.alias, gridDef.id, gridDef.store, gridDef.plugins, gridDef.columnLines, gridDef.onInit);
            return grid;
        });


}(window.$nameSpace$));
