/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _panelIIFE(n$) {

    /**
     * Define the properties which are available to Panel.
    */
    var panelProperties = Object.create(null);
    panelProperties.items = 'items';
    n$.constant(n$.panels, 'properties', panelProperties);

    /**
     * Private class representing the construnction of a panel. It returns a n$.panel.panel instance with collections for adding columns and listeners.
     * @param name {String} The ClassName of the panel to associate with ExtJS
     * @param requires {Array} An array of ExtJS dependencies
     * @param extend {String} [extend='Ext.panel.Panel'] An ExtJs class name to extend, usually the panel panel
     * @param alias {Array} [alias] An array of aliases to reference the panel
     * @param id {String} An id to uniquely identify the panel
     * @param store {n$.panels.stores.store} A store to provide data to the panel
     * @param plugins {Array} An array of plugins to load with the panel
    */
    var Panel = function (name, requires, extend, alias, id, store, plugins) {
        'use strict';
        var that = n$.classDefinition({
            name: name,
            requires: requires,
            extend: extend || 'Ext.panel.Panel',
            alias: alias,
            id: id,
            store: store,
            plugins: plugins,
            namespace: 'panels'
        });

        return that;
    };

    n$.instanceOf.lift('Panel', Panel);

    n$.panels.lift('panel',
        /**
         * Create a panel object.
         * @returns {Csw.panels.panel} A panel object. Exposese listeners and columns collections. Call init when ready to construct the panel. 
        */
        function panelFunc(panelDef) {
            'use strict';
            if (!(panelDef)) {
                throw new Error('Cannot instance a panel without properties');
            }
            if (!(panelDef.name)) {
                throw new Error('Cannot instance a panel without a classname');
            }
            var panel = new Panel(panelDef.name, panelDef.requires, panelDef.extend, panelDef.alias, panelDef.id, panelDef.store, panelDef.plugins);
            return panel;
        });


}(window.$nameSpace$));
