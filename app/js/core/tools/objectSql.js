/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _propertyIIFE(n$) {

    Object.defineProperties(Array.prototype, {
        '_where': {
            value: function(func) {
                return n$.filter(func, this);
            }
        },
        '_select': {
            value: function(func) {
                return n$.map(func, this);
            }
        }
    });
    
    function select() {
        var query = this;
    
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 0);
        query.columns = query.columns || [];
        n$.each(args, function(argumentValue) {
            query.columns.push(argumentValue);
        });
        return query;
    }
    
    function run() {
        var query = this;
        var ret = [];
        if (query.columns.length > 0) {
            var results = [];
            n$.each(query.columns, function(columnName) {
    
                n$.each(query.tables, function(tbl) {
                    if (Array.isArray(tbl)) {
                        var res = {};
                        var val = tbl._select(function(val) {
                            return val[columnName];
                        });
                        if (val) {
                            res[columnName] = val;
                            results.push(res);
                        }
                    }
                }, true);
    
            });
    
            var returnRows = [];
            if(results && results.length > 0) {
                var firstResult = results[0];
                
                n$.each(firstResult, function(val, key) {
                    
                    n$.each(val, function(cell){
                        var row = {};
                        row[key] = cell;
                        n$.each(results.slice(1), function(result) {
                            n$.each(result, function(v,k){
                                n$.each(v, function(c) {
                                    row[k] = c;
                                });
                            },true);
                        },true);
                        returnRows.push(row);
                    },true);
                    
                },true)
                
            }
            
        }
        return returnRows;
    }
    
    function from(array) {
        var query = this;
        query.tables.push(array);
        return query;
    }
    
    var query = function(array) {
        var tables = [];
        tables.push(array);
        var _query = {
            tables: tables,
            from: from,
            select: select  ,
            run: run
        };
        return _query;
    };

    n$.lift('objectSql', query);

}(window.$nameSpace$));
