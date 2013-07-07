/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _columnsIIFE(n$) {

    //n$.dependsOn(['n$.dataModels.field'], function () {

    /**
     * Defines a collection of columns
     */
    var Columns = function () {
        'use strict';

        var that = this;
        n$.property(that, 'value', []);
        n$.property(that, 'add',
            /**
             * Add a column to the collection
            */
            function add(column) {
                if (!(column instanceof n$.instanceOf.Column)) {
                    throw new Error('Only columns can be added to the Columns collection');
                }
                that.value.push(column);
                return that;
            });
        return that;
    };

    n$.instanceOf.register('Columns', Columns);

    n$.grids.columns.register('columns',
        /**
         * A mechanism for generating columns
         */
        function columns() {
            'use strict';
            var ret = new Columns();
            return ret;
        });

    //});

}(window.$nameSpace$));
