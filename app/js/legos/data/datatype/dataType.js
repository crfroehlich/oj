/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _dataTypeIIFE(n$) {

    /**
     * Data Types: the meta data attributes for a value (e.g. the value of a cell in a grid, or the value of a node in a tree, or the value of an input text box)
    */
    n$.makeSubNameSpace('dataTypes');

    /**
     * The private constructor for a DataType object.
     * @param defaultValue {String} [defaultValue] A default value
    */
    var DataType = function (name, type, defaultValue) {
        var that = this;
        n$.property(that, 'type', type || 'string');
        n$.property(that, 'name', name);

        if (defaultValue) {
            n$.property(that, 'defaultValue', defaultValue);
        }
        return that;
    };

    n$.instanceOf.register('DataType', DataType);

    /**
     * Create a new dataType
     * @param namme {String} A unique name for this dataType
     * @param type {String} [type='string'] The display type of this dataType
     * @param defaultValue {String} [defaultValue] A default value
    */
    n$.dataTypes.register('type', function (name, type, defaultValue) {
        if (!name) {
            throw new Error('Cannot create a dataType without a name');
        }
        var ret = new DataType(name, type, defaultValue);
        return ret;
    });


}(window.$nameSpace$));
