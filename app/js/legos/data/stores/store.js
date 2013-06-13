/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _storeIIFE() {

    /**
     * A Store is a collection of data that is to be rendered in a View or Panel.
     * This private class can never be directly instanced.
     * @param name {String} A name for the store class
     * @param proxy {OJ.stores.proxy} A proxy for loading data into the store
     * @param model {OJ.models.model} The model of the store
    */
    var Store = function(name, proxy, model) {
        var that = OJ.classDefinition({
            name: name,
            extend: 'Ext.data.Store',
            onDefine: function(classDef) {
                OJ.property(classDef, 'autoSync', true);
                OJ.property(classDef, 'proxy', proxy || OJ.stores.proxy('memory'));
                OJ.property(classDef, 'model', model);
                delete classDef.initComponent;
            }
        });
        
        return that;
    };

    OJ.instanceOf.lift('Store', Store);

    /**
     * Instance a new Store for consumption by an Ext view or panel
     * @param storeDef.name {String} A name for the store class
     * @param storeDef.proxy {OJ.stores.proxy} A proxy for loading data into the store
     * @param storeDef.model {OJ.models.model} The model of the store
     * @returns {OJ.stores.store} A OJ store
    */
    OJ.stores.lift('store', function(storeDef) {
        if (!storeDef) {
            throw new Error('Cannot create a Store without options.');
        }
        if (!(storeDef.proxy instanceof OJ.instanceOf.Proxy)) {
            storeDef.proxy = OJ.stores.proxy('memory');
        }
        if (!storeDef.model) {
            throw new Error('Cannot create a Store without a Model.');
        }
        var ret = new Store(storeDef.name, storeDef.proxy, storeDef.model);
        return ret.init();
    });

}());