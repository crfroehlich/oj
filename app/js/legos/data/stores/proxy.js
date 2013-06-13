/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _proxyClassIIFE(n$) {

    /**
     * Internal class to define a Proxy. This class cannot be directly instanced.
     */
    var Proxy = function(type) {
        var that = this;

        n$.property(that, 'type', type);

        return that;
    };

    n$.instanceOf.lift('Proxy', Proxy);

    /**
     * Instance a new Proxy. Proxies are the mechanisms by which Stores are populated with data.
     * Currently, only Proxy types of 'memory' are supported.
     * @param type {String} The type of proxy
     */
    n$.stores.lift('proxy', function(type) {
        if(type !== 'memory') {
            throw new Error('Only proxy types of "memory" are supported.');
        }
        var ret = new Proxy(type);
        
        return ret;
    });

}(window.$nameSpace$));
