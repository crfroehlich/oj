/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _treelIIFE(n$) {

    /**
     * Define the properties which are available to Grid.
    */
    var windowProperties = n$.object();
    windowProperties.add('minWidth', 'minWidth');
    windowProperties.add('cascadeOnFirstShow', 'cascadeOnFirstShow');
    windowProperties.add('height', 'height');
    windowProperties.add('width', 'width');
    windowProperties.add('shadowSprite', 'shadowSprite');
    windowProperties.add('layout', 'layout');
    windowProperties.add('closable', 'closable');
    windowProperties.add('connection', 'connection');
    n$.constant(n$.okna, 'properties', windowProperties);

    /**
     * Private class representing the construnction of a window (okno). It returns a n$.okna.okno instance with collections for adding listeners.
     * @param name {String} The ClassName of the window (okno) to associate with ExtJS
     * @param requires {Array} An array of ExtJS dependencies
     * @param extend {String} [extend='Ext.window.Window'] An ExtJs class name to extend, usually the window Window
     * @param alias {Array} [alias] An array of aliases to reference the window (okno)
     * @param id {String} An id to uniquely identify the window (okno)
     * @param store {n$.stores.store} A store to provide data to the window (okno)
     * @param plugins {Array} An array of plugins to load with the window (okno)
     * @param onInit {Function} [onInit] Optional callback to be applied on construction
    */
    var Okno = function (name, requires, extend, alias, id, store, plugins, onInit) {
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
            namespace: 'okna'
        });
        if (onInit) {
            that.addInitComponent(function (them) {
                onInit(them);
            });
        }
        return that;
    };

    n$.instanceOf.lift('Okno', Okno);

    n$.okna.lift('okno',
        /**
         * Create a window (okno) object.
         * @param windowDef.treeName {String} The ClassName of the window (okno) to associate with ExtJS
         * @param windowDef.requires {Array} An array of ExtJS dependencies
         * @param windowDef.extend {String} [extend='Ext.window.Window'] An ExtJs class name to extend, usually the window Window
         * @param windowDef.alias {Array} [alias] An array of aliases to reference the window (okno)
         * @param windowDef.id {String} An id to uniquely identify the window (okno)
         * @param windowDef.store {n$.trees.stores.store} A store to provide data to the window (okno)
         * @param windowDef.plugins {Array} An array of plugins to load with the window (okno)
         * @param windowDef.onInit {Function} [onInit] Optional callback to be applied on construction
         * @returns {Csw.trees.okno} A okno object. Exposese listeners and columns collections. Call init when ready to construct the okno. 
        */
        function oknofunc(windowDef) {
            'use strict';
            if (!(windowDef)) {
                throw new Error('Cannot instance a window (okno) without properties');
            }
            if (!(windowDef.name)) {
                throw new Error('Cannot instance a window (okno) without a classname');
            }
            var okno = new Okno(windowDef.name, windowDef.requires, windowDef.extend, windowDef.alias, windowDef.id, windowDef.store, windowDef.plugins, windowDef.onInit);
            return okno;
        });


}(window.$nameSpace$));
