/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _classDefinitionIIFE(n$) {

    /**
     * Private constructor to create an object suitable for defining a new class
     * @param name {String} The name of this class
     * @param extend {String} The ExtJS class to extend/copy
     * @param requires {Array} [requires] An array of dependencies
     * @param alias {Array} [alias] An array of alternate names for this class
     * @param id {String} [id] A unique id for this class
     * @param store {n$.store} [store] A data store for this class
     * @param plugins {Array} [plugins] An array of plugins to initialize with new instances of this class
     * @param constant {String} [constant] A n$.constants constant to constrain property additions
     * @param namespace {String} A n$ namespace to constrain listeners
     * @param onDefine {Function} [onDefine] A method to call when the class definition is defined on the Ext namespace
     * @param debug {Boolean} [debug=false] For development debugging purposes. If true, output log content.
    */
    var ClassDefinition = function(name, extend, requires, alias, id, store, plugins, constant, namespace, onDefine, debug) {
        var that = this;
        var classDef = {};

        /**
         * Set of properties most Ext classes share
        */
        if (extend)     { n$.property(classDef, 'extend', extend); }
        if (requires)   { n$.property(classDef, 'requires', requires); }
        if (alias)      { n$.property(classDef, 'alias', alias); }
        if (id)         { n$.property(classDef, 'id', id); }
        if (plugins)    { n$.property(classDef, 'plugins', plugins); }
        if (store)      { n$.property(classDef, 'store', store); }

        /**
         * initComponents are created when the class is instanced; they are not part of the class definition--except as callbacks
         * This is unusual. Most classes do not need this mechanism. See tableGrid for example.
        */
        var initComponents = [];
        n$.property(that, 'addInitComponent', function (method) {
            if (method) {
                initComponents.push(method);
            }
        }, false, false, false);

        /**
         * We don't allow listeners to be defined ad hoc; and if they are defined, they must be defined on the namespace listener object
        */
        if (namespace && n$[namespace]) {
            var listeners = n$[namespace].listeners.listeners();
            n$.property(that, 'listeners', listeners);
            n$.property(that.listeners, 'exception', function() {
                n$.console.error('An error occurred in ' + name + '.', arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            });
            /**
             * Interface to Add to the properties that will become part of the Ext class
            */
            if (n$[namespace].constants.properties) {
                n$.property(that, 'addProp', function (propName, value) {
                    if (!(n$[namespace].constants.properties.has(propName))) {
                        throw new Error('Property named "' + propName + '" has not be defined on n$.' + namespace + '.constants.properties.');
                    }
                    n$.property(classDef, propName, value);
                }, false, false, false);
            }
        }
        
        /**
         * init must be manually called when the class is ready to be constructed (e.g. defined on Ext)
        */
        n$.property(that, 'init', function () {
            n$.property(classDef, 'initComponent', function () {
                var them = this;
                if (initComponents.length > 0) {
                    n$.each(initComponents, function (func) {
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
                    n$.property(classDef, 'viewConfig', {});
                    n$.property(classDef.viewConfig, 'listeners', that.listeners);
                } else {
                    n$.property(classDef, 'listeners', listeners);
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

    n$.instanceOf.lift('ClassDefinition', ClassDefinition);

    /**
     * Define declares a new class on the ExtJs namespace
     * @param def {Object} defintion object with possible properties: def.name def.extend, def.requires, def.alias, def.id, def.store, def.plugins, def.constant, def.onDefine
     * @param def.name {String} The name of this class
     * @param def.extend {String} The ExtJS class to extend/copy
     * @param def.requires {Array} [def.requires] An array of dependencies
     * @param def.alias {Array} [def.alias] An array of alternate names for this class
     * @param def.id {String} [def.id] A unique id for this class
     * @param def.store {n$.store} [def.store] A data store for this class
     * @param def.plugins {Array} [def.plugins] An array of plugins to initialize with new instances of this class
     * @param def.constant {String} [def.constant] A n$.constants constant to constrain property additions
     * @param def.namespace [String] A n$ namespace to constrain listeners
     * @param def.onDefine {Function} [def.onDefine] A method to call when the class definition is defined on the Ext namespace
    */
    n$.lift('classDefinition', function(def) {
        if(!def) {
            throw new Error('Cannot create a definition without parameters.');
        }
        if (!(typeof def.name === 'string')) {
            throw new Error('Cannot define a class without a name');
        }
        var ret = new ClassDefinition(def.name, def.extend, def.requires, def.alias, def.id, def.store, def.plugins, def.constant, def.namespace, def.onDefine);
        return ret;
    });

}(window.$nameSpace$));
