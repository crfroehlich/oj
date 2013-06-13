/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _classDefinitionIIFE() {

    /**
     * Private constructor to create an object suitable for defining a new class
     * @param name {String} The name of this class
     * @param extend {String} The ExtJS class to extend/copy
     * @param requires {Array} [requires] An array of dependencies
     * @param alias {Array} [alias] An array of alternate names for this class
     * @param id {String} [id] A unique id for this class
     * @param store {OJ.store} [store] A data store for this class
     * @param plugins [Array] [plugins] An array of plugins to initialize with new instances of this class
     * @param constant [String] [constant] A OJ.constants constant to constrain property additions
     * @param namespace [String] An OJ namespace to constrain listeners
     * @param onDefine [Function] [onDefine] A method to call when the class definition is defined on the Ext namespace
    */
    var ClassDefinition = function(name, extend, requires, alias, id, store, plugins, constant, namespace, onDefine) {
        var that = this;
        var classDef = {};

        /**
         * Set of properties most Ext classes share
        */
        if (extend)     { OJ.property(classDef, 'extend', extend); }
        if (requires)   { OJ.property(classDef, 'requires', requires); }
        if (alias)      { OJ.property(classDef, 'alias', alias); }
        if (id)         { OJ.property(classDef, 'id', id); }
        if (plugins)    { OJ.property(classDef, 'plugins', plugins); }
        if (store)      { OJ.property(classDef, 'store', store); }

        /**
         * initComponents are created when the class is instanced; they are not part of the class definition--except as callbacks
         * This is unusual. Most classes do not need this mechanism. See tableGrid for example.
        */
        var initComponents = [];
        OJ.property(that, 'addInitComponent', function (method) {
            if (method) {
                initComponents.push(method);
            }
        }, false, false, false);

        /**
         * We don't allow listeners to be defined ad hoc; and if they are defined, they must be defined on the namespace listener object
        */
        if (namespace && OJ[namespace]) {
            var listeners = OJ[namespace].listeners.listeners();
            OJ.property(that, 'listeners', listeners);
            /**
             * Interface to Add to the properties that will become part of the Ext class
            */
            if (OJ[namespace].constants.properties) {
                OJ.property(that, 'addProp', function (propName, value) {
                    if (!(OJ[namespace].constants.properties.has(propName))) {
                        throw new Error('Property named "' + propName + '" has not be defined on OJ.' + namespace + '.constants.properties.');
                    }
                    OJ.property(classDef, propName, value);
                }, false, false, false);
            }
        }
        
        /**
         * init must be manually called when the class is ready to be constructed (e.g. defined on Ext)
        */
        OJ.property(that, 'init', function () {
            OJ.property(classDef, 'initComponent', function () {
                var them = this;
                if (initComponents.length > 0) {
                    OJ.each(initComponents, function (func) {
                        func(them);
                    });
                }
                them.callParent(arguments);
            });

            if (listeners && Object.keys(listeners).length > 0) {
                /**
                 * Bit of a hack; but grids are a special case.
                */
                if (namespace === 'grids') {
                    OJ.property(classDef, 'viewConfig', {});
                    OJ.property(classDef.viewConfig, 'listeners', that.listeners);
                } else {
                    OJ.property(classDef, 'listeners', listeners);
                }
            }

            if (onDefine) {
                onDefine(classDef, that);
            }

            var ret = Ext.define(name, classDef);
            
            return ret;
        });

        return that;
    };

    OJ.instanceOf.lift('ClassDefinition', ClassDefinition);

    /**
     * Define declares a new class on the ExtJs namespace
     * @param def {Object} defintion object with possible properties: def.name def.extend, def.requires, def.alias, def.id, def.store, def.plugins, def.constant, def.onDefine
     * @param def.name {String} The name of this class
     * @param def.extend {String} The ExtJS class to extend/copy
     * @param def.requires {Array} [def.requires] An array of dependencies
     * @param def.alias {Array} [def.alias] An array of alternate names for this class
     * @param def.id {String} [def.id] A unique id for this class
     * @param def.store {OJ.store} [def.store] A data store for this class
     * @param def.plugins {Array} [def.plugins] An array of plugins to initialize with new instances of this class
     * @param def.constant {String} [def.constant] A OJ.constants constant to constrain property additions
     * @param def.namespace [String] An OJ namespace to constrain listeners
     * @param def.onDefine {Function} [def.onDefine] A method to call when the class definition is defined on the Ext namespace
    */
    OJ.lift('classDefinition', function(def) {
        if(!def) {
            throw new Error('Cannot create a definition without parameters.');
        }
        if (!(typeof def.name === 'string')) {
            throw new Error('Cannot define a class without a name');
        }
        var ret = new ClassDefinition(def.name, def.extend, def.requires, def.alias, def.id, def.store, def.plugins, def.constant, def.namespace, def.onDefine);
        return ret;
    });

}());