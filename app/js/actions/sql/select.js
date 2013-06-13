/* global window:true, Ext:true */

(function(n$) {
    
    var select = function() {
        var ret = n$.object();
        ret.add('tables', n$.actions.sql.tables(ret));
        ret.add('fields', n$.actions.sql.fields(ret));
        ret.add('joins', n$.actions.sql.joins(ret));

        var sortTablesByJoins = function(tables, oUsedTables) {
            var aTables = [], aJoins = [], oUsedTables = oUsedTables ||
                {};
            // loop over tables
            for (var i = 0, aCondition = [], aJoin, l = tables.length; i < l; i++) {
                // check if current table is a new one
                if (!oUsedTables.hasOwnProperty(tables[i].get('id'))) {
                    // it is a new one
                    aTables.push(tables[i]);
                    // mark table as used
                    oUsedTables[tables[i].get('id')] = true;
                    // get any joins for the current table
                    aJoin = ret.joins.getJoinsByTableId(tables[i].get('id'));
                    // loop over the join tables
                    for (var j = 0, joinTable, len = aJoin.length; j < len; j++) {
                        // check if it is a new join
                        if (!oUsedTables.hasOwnProperty(aJoin[j].get('id'))) {
                            // mark join as used
                            oUsedTables[aJoin[j].get('id')] = true;
                            if (tables[i].get('id') != aJoin[j].get('leftTableId')) {
                                joinTable = ret.tables.getTableById(aJoin[j].get('leftTableId'));
                                ret.changeLeftRightOnJoin(aJoin[j]);
                            } else {
                                joinTable = ret.tables.getTableById(aJoin[j].get('rightTableId'));
                            }
                            oTemp = ret.sortTablesByJoins([joinTable], oUsedTables);
                            oUsedTables = oTemp.oUsedTables;
                            aTables = aTables.concat(oTemp.aTables);
                        }
                    }
                }
            }

            return {
                aTables: aTables,
                oUsedTables: oUsedTables
            };
        };
        ret.add('sortTablesByJoins', sortTablesByJoins);
        
        var changeLeftRightOnJoin = function(join) {
            var leftTable, leftTableField, rightTable, rightTableField, joinCondition = '';
            // prepare new data
            leftTable = ret.tables.getTableById(join.get('rightTableId'));
            leftTableField = join.get('rightTableField');
            rightTable = ret.tables.getTableById(join.get('leftTableId'));
            rightTableField = join.get('leftTableField');

            // construct new joinCondition
            if (leftTable.get('tableAlias') != '') {
                joinCondition = joinCondition + leftTable.get('tableAlias') + '.' + join.get('rightTableField') + '=';
            } else {
                joinCondition = joinCondition + leftTable.get('tableName') + '.' + join.get('rightTableField') + '=';
            }

            if (rightTable.get('tableAlias') != '') {
                joinCondition = joinCondition + rightTable.get('tableAlias') + '.' + join.get('leftTableField');
            } else {
                joinCondition = joinCondition + rightTable.get('tableName') + '.' + join.get('leftTableField');
            }

            // start transaction
            join.beginEdit();
            // change left and right join table data
            join.set('leftTableId', leftTable.get('id'));
            join.set('leftTableField', leftTableField);
            join.set('rightTableId', rightTable.get('id'));
            join.set('rightTableField', rightTableField);
            join.set('joinCondition', joinCondition);
            // silent commit without firing store events
            // this prevents endless loop
            join.commit(true);
            join.endEdit();
            // end transaction
            return;
        };
        ret.add('changeLeftRightOnJoin', changeLeftRightOnJoin);

        var arrayRemove = function(array, filterProperty, filterValue) {
            var aReturn;
            aReturn = Ext.Array.filter(array, function(item) {
                var bRemove = true;
                if (item[filterProperty] == filtervalue) {
                    bRemove = false;
                }
                return bRemove;
            });
            return aReturn;
        };
        ret.add('arrayRemove', arrayRemove);

        var updateSQLOutput = function() {
            var sqlOutput, sqlHTML, sqlQutputPanel;
            sqlOutput = ret.sqlToString();
            sqlHTML = '<pre class="brush: sql">' + sqlOutput + '</pre>';
            sqlQutputPanel = Ext.getCmp('qbOutputPanel');

            sqlQutputPanel.update(sqlHTML);
        };
        ret.add('updateSQLOutput', updateSQLOutput);

        var sqlToString = function() {
            var sqlOutput = 'SELECT ',
                aJoins = [],
                aOutputFields = [],
                oJoinTables = {},
                aTables = [],
                aCriteriaFields = [],
                aGroupFields = [],
                aOrderFields = [],
                selectFieldsSQL = '',
                fromSQL = '',
                aFromSQL = [],
                criteriaSQL = '',
                orderBySQL = '',
                groupBySQL = '',
                fieldSeperator = ', ',
                joinSQL = '',
                bFirst = true;
            
            ret.fields.each(function(field) {
                // should the field be a part of the output
                if (field.get('output')) {
                    aOutputFields.push(field);
                }
                // any criteria
                if (field.get('criteria') != '') {
                    aCriteriaFields.push(field);
                }
                // check for grouping
                if (field.get('grouping')) {
                    aGroupFields.push(field);
                }
                // check for sorting
                if (field.get('sortType') != '') {
                    aOrderFields.push(field);
                }
            });

            // tables
            // sorting of tables
            ret.tables.each(function(table) {
                aTables.push(table);
            });

            aTables = ret.sortTablesByJoins(aTables).aTables;


            ret.joins.each(function(join) {
                aJoins.push(join);
            });

            //create fromSQL
            for (var k = 0, aJoin = [], oJoinTables = {}, joinCondition = '', joinType, leftTable, rightTable, l = aTables.length; k < l; k++) {
                if (k == aTables.length - 1) {
                    fieldSeperator = '';
                } else {
                    fieldSeperator = ', ';
                }

                // is the current table the first one
                if (bFirst) {
                    // yes it is the first

                    // table id merken
                    oJoinTables[aTables[k].get('id')] = true;

                    bFirst = false;

                    // check if current table is not the last one in the loop
                    if ((k + 1) < aTables.length) {
                        // get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
                        for (var h = 0, len = aJoins.length; h < len; h++) {
                            if (oJoinTables.hasOwnProperty(aJoins[h].get('leftTableId')) && aJoins[h].get('rightTableId') == aTables[k + 1].get('id')) {
                                aJoin.push(aJoins[h]);
                            }
                            if (oJoinTables.hasOwnProperty(aJoins[h].get('rightTableId')) && aJoins[h].get('leftTableId') == aTables[k + 1].get('id')) {
                                ret.changeLeftRightOnJoin(aJoins[h]);
                                aJoin.push(aJoins[h]);
                            }
                        }

                        // check if we have a join
                        if (aJoin.length > 0) {
                            // yes we have a join between aTables[k] and aTables[k+1] with at least one join condition

                            leftTable = aTables[k];
                            rightTable = aTables[k + 1];

                            // table id merken
                            oJoinTables[rightTable.get('id')] = true;

                            for (var j = 0, fieldSeperator = '', ln = aJoin.length; j < ln; j++) {
                                if (j == aJoin.length - 1) {
                                    fieldSeperator = '';
                                } else {
                                    fieldSeperator = '\nAND ';
                                }
                                ;
                                joinType = aJoin[j].get('joinType');
                                joinCondition = joinCondition + aJoin[j].get('joinCondition') + fieldSeperator;
                            }

                            // reset the join array
                            aJoin = [];

                            if (joinSQL != '') {
                                joinSQL = joinSQL + ',\n';
                            }

                            if (leftTable.get('tableAlias') != '') {
                                // we have an leftTable alias
                                joinSQL = joinSQL + leftTable.get('tableName') + ' ' + leftTable.get('tableAlias') + ' ' + joinType + ' JOIN ';
                            } else {
                                //no alias
                                joinSQL = joinSQL + leftTable.get('tableName') + ' ' + joinType + ' JOIN ';
                            }

                            if (rightTable.get('tableAlias') != '') {
                                // we have an rightTable alias
                                joinSQL = joinSQL + rightTable.get('tableName') + ' ' + rightTable.get('tableAlias') + ' ON ' + joinCondition;
                            } else {
                                //no alias
                                joinSQL = joinSQL + rightTable.get('tableName') + ' ON ' + joinCondition;
                            }

                            // clear joinCondition
                            joinCondition = '';

                        } else {
                            // no join between aTables[i+1] and the one before
                            bFirst = true;
                            oJoinTables = {};
                            // check for tableAlias
                            if (aTables[k].get('tableAlias') != '') {
                                fromSQL = aTables[k].get('tableName') + ' ' + aTables[k].get('tableAlias');
                            } else {
                                fromSQL = aTables[k].get('tableName');
                            }
                            aFromSQL.push(fromSQL);
                        }
                    } else {
                        // its the last and only one in the loop
                        // check for tableAlias
                        if (aTables[k].get('tableAlias') != '') {
                            fromSQL = aTables[k].get('tableName') + ' ' + aTables[k].get('tableAlias');
                        } else {
                            fromSQL = aTables[k].get('tableName');
                        }
                        aFromSQL.push(fromSQL);
                    }
                } else {
                    // no, it is not the first table

                    bFirst = true;

                    // check if current table is not the last one in the loop
                    if ((k + 1) < aTables.length) {
                        // get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
                        for (var h = 0, len = aJoins.length; h < len; h++) {
                            if (oJoinTables.hasOwnProperty(aJoins[h].get('leftTableId')) && aJoins[h].get('rightTableId') == aTables[k + 1].get('id')) {
                                aJoin.push(aJoins[h]);
                            }
                            if (oJoinTables.hasOwnProperty(aJoins[h].get('rightTableId')) && aJoins[h].get('leftTableId') == aTables[k + 1].get('id')) {
                                ret.changeLeftRightOnJoin(aJoins[h]);
                                aJoin.push(aJoins[h]);
                            }
                        }

                        // check if we have a join
                        if (aJoin.length > 0) {
                            // yes we have a join between aTables[k] and aTables[k+1] with at least one join condition

                            rightTable = aTables[k + 1];

                            // table id merken
                            oJoinTables[rightTable.get('id')] = true;

                            for (var j = 0, fieldSeperator = '', ln = aJoin.length; j < ln; j++) {
                                if (j == aJoin.length - 1) {
                                    fieldSeperator = '';
                                } else {
                                    fieldSeperator = '\nAND ';
                                }
                                ;
                                joinType = aJoin[j].get('joinType');
                                joinCondition = joinCondition + aJoin[j].get('joinCondition') + fieldSeperator;
                            }

                            // reset the join array
                            aJoin = [];

                            bFirst = false;

                            if (rightTable.get('tableAlias') != '') {
                                // we have an rightTable alias
                                joinSQL = joinSQL + '\n' + joinType + ' JOIN ' + rightTable.get('tableName') + ' ' + rightTable.get('tableAlias') + ' ON ' + joinCondition;
                            } else {
                                //no alias
                                joinSQL = joinSQL + '\n' + joinType + ' JOIN ' + rightTable.get('tableName') + ' ON ' + joinCondition;
                            }

                            // clear joinCondition
                            joinCondition = '';
                        } else {
                            bFirst = true;
                            oJoinTables = {};
                        }
                    } else {
                        // its the last and only one
                        // check for tableAlias
                        oJoinTables = {};
                    }
                }
            }

            fromSQL = aFromSQL.join(', ');

            if (joinSQL != '' && fromSQL != '') {
                joinSQL = joinSQL + ', ';
            }

            fromSQL = '\nFROM ' + joinSQL + fromSQL;

            // output fields
            for (var iOut = 0, l = aOutputFields.length; iOut < l; iOut += 1) {
                // check if it is the last array member
                if (iOut == aOutputFields.length - 1) {
                    fieldSeperator = '';
                } else {
                    fieldSeperator = ', ';
                }
                ;
                // yes, output
                // check alias
                if (aOutputFields[iOut].get('alias') != '') {
                    // yes, we have an field alias
                    selectFieldsSQL = selectFieldsSQL + aOutputFields[iOut].get('expression') + ' AS ' + aOutputFields[iOut].get('alias') + fieldSeperator;
                } else {
                    // no field alias
                    selectFieldsSQL = selectFieldsSQL + aOutputFields[iOut].get('expression') + fieldSeperator;
                }
            }

            // criteria
            for (var iWhere = 0, l = aCriteriaFields.length; iWhere < l; iWhere += 1) {
                if (iWhere == 0) {
                    criteriaSQL = criteriaSQL + '\nWHERE ';
                } else {
                    criteriaSQL = criteriaSQL + 'AND ';
                }
                if (iWhere == aCriteriaFields.length - 1) {
                    fieldSeperator = '';
                } else {
                    fieldSeperator = '\n';
                }
                criteriaSQL = criteriaSQL + aCriteriaFields[iWhere].get('expression') + ' ' + aCriteriaFields[iWhere].get('criteria') + fieldSeperator;
            }

            // group by
            for (var iGroup = 0, l = aGroupFields.length; iGroup < l; iGroup += 1) {
                // check if it is the last array member
                if (iGroup == aGroupFields.length - 1) {
                    fieldSeperator = '';
                } else {
                    fieldSeperator = ', ';
                }
                if (iGroup == 0) {
                    groupBySQL = '\nGROUP BY ';
                }
                groupBySQL = groupBySQL + aGroupFields[iGroup].get('expression') + fieldSeperator;
            }

            // order by
            for (var iOrder = 0, l = aOrderFields.length; iOrder < l; iOrder += 1) {
                // check if it is the last array member
                if (iOrder == aOrderFields.length - 1) {
                    fieldSeperator = '';
                } else {
                    fieldSeperator = ', ';
                }
            }

            return sqlOutput + selectFieldsSQL + fromSQL + criteriaSQL + groupBySQL + orderBySQL;
        };

        ret.add('sqlToString', sqlToString);

        return ret;
    };
    
    n$.actions.sql.lift('select', select);

}(window.$nameSpace$));
