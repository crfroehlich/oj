/* jshint undef: true, unused: true */
/* global Ext  */

(function (n$) {

    var joins = function (select) {
        var ret = new n$.actions.querybuilder.SqlDragDropTableJoinStore({
            storeId: 'JoinStore'
        });

        ret.handleSQLJoinChanges = function(joinStore, join) {
            select.updateSQLOutput();
        };

        // this.joins.on('update', this.handleSQLJoinChanges, this);
        ret.on('add', ret.handleSQLJoinChanges, select);
        ret.on('remove', ret.handleSQLJoinChanges, select);

        ret.updateJoinTableData = function(table) {
            var joins, tableId;
            tableId = table.get('id');
            joins = ret.getJoinsByTableId(tableId);
            for (var i = 0, rightTable, leftTable, joinCondition = '', l = joins.length; i < l; i++) {
                leftTable = select.tables.getTableById(joins[i].get('leftTableId'));
                rightTable = select.tables.getTableById(joins[i].get('rightTableId'));

                if (leftTable.get('tableAlias') != '') {
                    joinCondition = joinCondition + leftTable.get('tableAlias') + '.' + joins[i].get('leftTableField') + '=';
                } else {
                    joinCondition = joinCondition + leftTable.get('tableName') + '.' + joins[i].get('leftTableField') + '=';
                }

                if (rightTable.get('tableAlias') != '') {
                    joinCondition = joinCondition + rightTable.get('tableAlias') + '.' + joins[i].get('rightTableField');
                } else {
                    joinCondition = joinCondition + rightTable.get('tableName') + '.' + joins[i].get('rightTableField');
                }
                joins[i].beginEdit();
                joins[i].set('joinCondition', joinCondition);
                joins[i].commit(true);
                joins[i].endEdit();
            }
        };

        ret.getJoinsByTableId = function(tableId) {
            var aReturn = [];
            select.joins.each(function(join) {
                if (join.get('leftTableId') == tableId || join.get('rightTableId') == tableId) {
                    aReturn.push(join);
                }
            });
            return aReturn;
        };

        ret.removeJoinById = function(joinID) {
            var join;
            join = select.joins.getById(joinID);
            ret.remove(join);
            return ret;
        };

        ret.addJoin = function (join) {
            ret.add(join);
            return ret;
        };

        return ret;
    };


    n$.actions.sql.lift('joins', joins);

}(window.$nameSpace$));
