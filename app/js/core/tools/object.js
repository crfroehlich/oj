/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _propertyIIFE(n$) {

    /**
     * Create an instance of Object
     * @param properties {Object} [properties={}] properties to define on the Object
     * @param inheritsFromPrototype {Prototype} [inheritsFromPrototype=null] The prototype to inherit from
    */
    var object = function (properties, inheritsFromPrototype) {
        
        if (!inheritsFromPrototype) {
            inheritsFromPrototype = null;
        }
        if (!properties) {
            properties = {};
        }
        var obj = Object.create(inheritsFromPrototype, properties);

        n$.property(obj, 'add',
            /**
             * Add a property to the object and return it
            */
            function (name, val, writable, configurable, enumerable) {
            return n$.property(obj, name, val, writable, configurable, enumerable);
        }, false, false, false);

        return obj;
    };

    n$.lift('object', object);

}(window.$nameSpace$));
