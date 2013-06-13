/* jshint undef: true, unused: true */
/* global Ext  */

(function (n$) {

    var tables = function(select) {
        var ret = new n$.actions.querybuilder.SqlTableNameStore({
            storeId: 'SqlTableNameStore'
        });

        ret.handleSQLTableUpdate = function (tableStore, table, operation) {
            if (operation == 'commit') {
                select.fields.updateFieldTableData(table);
                select.joins.updateJoinTableData(table);
                select.updateSQLOutput();
            }
        };

        ret.handleSQLTableAdd = function (tableStore, table, index) {
            select.updateSQLOutput();
        };

        ret.handleSQLTableRemove = function (tableStore, table, index) {
            var aJoins = [];
            // get table joins and remove them
            aJoins = select.joins.getJoinsByTableId(table.get('id'));
            // loop over the joins array
            for (var i = 0, l = aJoins.length; i < l; i++) {
                // remove join from store
                select.joins.removeJoinById(aJoins[i].get('id'));
            }
            select.updateSQLOutput();
        };

        // handle all updates on sql tables
        ret.on('update', ret.handleSQLTableUpdate, select);
        ret.on('add', ret.handleSQLTableAdd, select);
        ret.on('remove', ret.handleSQLTableRemove, select);

        ret.addTable = function(table) {
            ret.add(table);
            return ret;
        };

        ret.removeTableById = function(tableID) {
            var table;
            table = ret.getById(tableID);
            ret.remove(table);
            return ret;
        };
        
        ret.getTableById = function(tableID) {
            return ret.getById(tableID);
        };

        return ret;
    };


    n$.actions.sql.lift('tables', tables);

}(window.$nameSpace$));
