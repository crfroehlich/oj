/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _storeIIFE() {

    /**
     * A Store is a collection of data that is to be rendered in a View or Panel.
     * This private class can never be directly instanced.
    */
    var Store = function(name, proxy, model) {
        var that = OJ.classDefinition({
            name: name,
            extend: 'Ext.data.Store',
            onDefine: function(classDef) {
                OJ.property(classDef, 'autoSync', true);
                OJ.property(classDef, 'proxy', proxy || OJ.stores.proxy('memory'));
                OJ.property(classDef, 'model', model);
            }
        });
        
        return that;
    };

    OJ.instanceOf.lift('Store', Store);

    /**
     * Instance a new Store for consumption by an Ext view or panel
     * @param name {String} A name for the store class
     * @param proxy {OJ.stores.proxy} A proxy for loading data into the store
     * @param model {String} The model of the store
    */
    OJ.stores.lift('store', function(name, proxy, model) {
        if(!(proxy instanceof OJ.instanceOf.Proxy)) {
            throw new Error('Cannot create a Store without a Proxy');
        }
        var ret = new Store(name, proxy, model);
        return ret;
    });

}());