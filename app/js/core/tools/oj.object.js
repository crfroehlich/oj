/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _propertyIIFE() {

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
        OJ.property(obj, 'add', function(name, val, writable, configurable, enumerable) {
            return OJ.property(obj, name, val, writable, configurable, enumerable);
        }, false, false, false);
        return obj;
    };

    OJ.lift('object', object);

}());