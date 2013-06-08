/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _fieldsIIFE() {

    //OJ.dependsOn(['OJ.models.field'], function () {

        /**
         * Defines a collection of fields
         */
        var Fields = function() {
            var that = this;
            /**
            * Get the value of the fields collection
            */
            OJ.property(that, 'value', []);

            OJ.property(that, 'add', 
                /**
                 * Add a validated field to the collection
                */
                function (field) {
                    if (!(field instanceof OJ.instanceOf.Field)) {
                        throw new Error('Only fields can be added to the Fields collection');
                    }
                    that.value.push(field);
                    return that;
            });
            return that;
        };

        OJ.instanceOf.lift('Fields', Fields);

        /**
         * A mechanism for generating fields
         */
        OJ.fields.lift('fields', function() {
            var ret = new Fields();
            return ret;
        });

    //});

}());