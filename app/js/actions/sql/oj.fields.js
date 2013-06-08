/* jshint undef: true, unused: true */
/* global Ext  */

(function () {

    var fields = function (select) {
        var ret = new OJ.actions.querybuilder.SqlFineTuningStore({
            storeId: 'SqlFineTuningStore'
        });

        ret.handleSQLFieldChanges = function(fieldStore, model, operation) {
            if (operation == 'commit') {
                select.updateSQLOutput();
            }
        };

        ret.handleSQLFieldRemove = function(fieldStore) {
            select.updateSQLOutput();
        };
        
        ret.on('update', ret.handleSQLFieldChanges, select);
        ret.on('remove', ret.handleSQLFieldRemove, select);
        
        ret.updateFieldTableData = function(table) {
            var tableId, expression, tableAlias, tableName;
            tableId = table.get('id');
            tableAlias = table.get('tableAlias');
            tableName = table.get('tableName');
            // loop over all fields of the fields store
            ret.each(function(field) {
                // check if current field belongs to sql table
                if (field.get('tableId') == tableId) {
                    if (tableAlias != '') {
                        // we have a table alias
                        expression = tableAlias + '.' + field.get('field');
                    } else {
                        // no table alias
                        expression = tableName + '.' + field.get('field');
                    }
                    ;
                    field.beginEdit();
                    // update the field table alias
                    field.set('tableAlias', tableAlias);
                    // update the field expression
                    field.set('expression', expression);
                    field.commit(true);
                    field.endEdit();
                }
            });
            return ret;
        };

        ret.removeFieldById = function(id) {
            var field;
            field = ret.getById(id);
            ret.remove(field);
            return ret;
        };

        ret.removeFieldsByTableId = function(tableId) {
            var aRecords = [];
            ret.each(function(model) {
                if (model.get('tableId') == tableId) {
                    aRecords.push(model);
                }
            });
            ret.remove(aRecords);
            return ret;
        };

        ret.addFieldRecord = function(record, bOutput) {
            var tableAlias, model, expression;
            // get the tableAlias
            tableAlias = select.tables.getTableById(record.get('tableId')).get('tableAlias');
            // build the expression
            // check if the tableAlias is not an empty string
            if (tableAlias != '') {
                // alias is not an empty string
                expression = tableAlias + '.' + record.get('field');
            } else {
                // alias is an empty string
                expression = record.get('tableName') + '.' + record.get('field');
            }
            ;
            // get a new field instance
            model = ret.getNewField();
            // set the expression
            model.set('expression', expression);
            // set output to false per default
            model.set('output', bOutput);
            // set an id, so it is possible to remove rows if the associated table is removed
            model.set('id', record.get('id'));
            // set the field
            model.set('field', record.get('field'));
            // copy tableId to the new model instance
            model.set('tableId', record.get('tableId'));
            // copy cmp id of origin qbSqlWindow to the new model instance
            model.set('extCmpId', record.get('extCmpId'));
            ret.addField(model);
            return ret;
        };

        ret.addField = function(field) {
            ret.add(field);
            return ret;
        };

        ret.getNewField = function() {
            return new OJ.actions.querybuilder.SqlFineTuningModel();
        };

        return ret;
    };


    OJ.actions.sql.lift('fields', fields);

}());