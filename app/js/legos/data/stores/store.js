/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _storeIIFE(n$) {


    /**
     * A Store is a collection of data that is to be rendered in a View or Panel.
     * This private class can never be directly instanced.
     * @param name {String} A name for the store class
     * @param proxy {n$.stores.proxy} A proxy for loading data into the store
     * @param model {n$.models.model} The model of the store
    */
    var Store = function (name, proxy, model) {
        'use strict';
        var that = n$.classDefinition({
            name: name,
            extend: 'Ext.data.Store',
            onDefine: function (classDef) {
                n$.property(classDef, 'autoSync', true);
                n$.property(classDef, 'proxy', proxy || n$.stores.proxy('memory'));
                n$.property(classDef, 'model', model);
                delete classDef.initComponent;
            }
        });

        return that;
    };

    n$.instanceOf.lift('Store', Store);

    n$.stores.lift('store',
        /**
         * Instance a new Store for consumption by an Ext view or panel
         * @param storeDef.name {String} A name for the store class
         * @param storeDef.proxy {n$.stores.proxy} A proxy for loading data into the store
         * @param storeDef.model {n$.models.model} The model of the store
         * @returns {n$.stores.store} A n$ store
        */
        function store(storeDef) {
            'use strict';
            if (!storeDef) {
                throw new Error('Cannot create a Store without options.');
            }
            if (!(storeDef.proxy instanceof n$.instanceOf.Proxy)) {
                storeDef.proxy = n$.stores.proxy('memory');
            }
            if (!storeDef.model) {
                throw new Error('Cannot create a Store without a Model.');
            }
            var ret = new Store(storeDef.name, storeDef.proxy, storeDef.model);
            return ret.init();
        });

}(window.$nameSpace$));
