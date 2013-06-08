/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _panelIIFE() {

    /**
     * Define the properties which are available to Panel.
    */
    var panelProperties = Object.create(null);
    panelProperties.items = 'items';
    OJ.constant(OJ.panels, 'properties', panelProperties);

    /**
     * Private class representing the construnction of a panel. It returns a OJ.panel.panel instance with collections for adding columns and listeners.
     * @param name {String} The ClassName of the panel to associate with ExtJS
     * @param requires {Array} An array of ExtJS dependencies
     * @param extend {String} [extend='Ext.panel.Panel'] An ExtJs class name to extend, usually the panel panel
     * @param alias {Array} [alias] An array of aliases to reference the panel
     * @param id {String} An id to uniquely identify the panel
     * @param store {OJ.panels.stores.store} A store to provide data to the panel
     * @param plugins {Array} An array of plugins to load with the panel
    */
    var Panel = function(name, requires, extend, alias, id, store, plugins) {
        var that = window.OJ.classDefinition({
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

    OJ.instanceOf.lift('Panel', Panel);

    /**
     * Create a panel object.
     * @returns {OJ.panels.panel} A panel object. Exposese listeners and columns collections. Call init when ready to construct the panel. 
    */
    OJ.panels.lift('panel', function(panelDef) {
        if(!(panelDef)) {
            throw new Error('Cannot instance a panel without properties');
        }
        if (!(panelDef.name)) {
            throw new Error('Cannot instance a panel without a classname');
        }
        var panel = new Panel(panelDef.name, panelDef.requires, panelDef.extend, panelDef.alias, panelDef.id, panelDef.store, panelDef.plugins);
        return panel;
    });


}());