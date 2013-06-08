/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _propertyIIFE() {


    /**
     * Add a property to an object
     * @param obj {Object} an Object onto which to add a property
     * @param name {String} the property name
     * @param value {Object} the value of the property. Can be any type.
     * @param writable {Boolean} [writable=true] True if the property can be modified
     * @param configurable {Boolean} [configurable=true] True if the property can be removed
     * @param enumerable {Boolean} [enumerable=true] True if the property can be enumerated and is listed in Object.keys
    */
    var property = function (obj, name, value, writable, configurable, enumerable) {
        if (!obj) {
            throw new Error('Cannot define a property without an Object.');
        }
        if (!(typeof name === 'string')) {
            throw new Error('Cannot create a property without a valid property name.');
        }
        
            var isWritable = (writable !== false);
            var isConfigurable = (configurable !== false);
            var isEnumerable = (enumerable !== false);
            
            Object.defineProperty(obj, name, {
                value: value,
                writable: isWritable,
                configurable: isConfigurable,
                enumerable: isEnumerable
            });
        
        return obj;
    };

    OJ.lift('property', property);

}());