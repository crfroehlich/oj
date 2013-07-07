/* jshint undef: true, unused: true */
/* global window:true, Ext:true, $: true */

(function _dataTypeCollectionIIFE(n$) {

    /**
     * Defines a collection of data types
     * @constructor
     * @internal
     */
    var DataTypeCollection = function () {
        var that = this;
        /**
        * Get the value of the data type collection
        */
        n$.property(that, 'value', []);

        n$.property(that, 'add',
            /**
             * Add a validated data type to the collection
            */
            function (dataType) {
                if (!(dataType instanceof n$.instanceOf.DataType)) {
                    throw new Error('Only fields can be added to the Fields collection');
                }
                that.value.push(dataType);
                return that;
            });
        return that;
    };

    n$.instanceOf.register('DataTypeCollection', DataTypeCollection);

    /**
     * A mechanism for generating data type
     */
    n$.dataTypes.register('collection', function () {
        var ret = new DataTypeCollection();
        return ret;
    });

}(window.$nameSpace$));
