/*global Q:true,Faker:true,$nameSpace$: true */

(function () {
    'use strict';
    
    n$.db.register('select', n$.makeNameSpace());

    /*
    * Private implementation method to select all records from a table
    * @param dbManager {n$.db.Manager} A DB Manager instance
    * @param tableName {String} The name of the table to select from
   */
    var selectAllImpl = function (dbManager, tableName, ret) {
        var deferred = Q.defer();
        var doSelect = function () {
            var transaction = dbManager.getDb().transaction([tableName]);

            var objectStore = transaction.objectStore(tableName);

            ret = ret || [];
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    ret.push(cursor.value);
                    cursor.continue();
                } else {
                    deferred.resolve(ret);
                }
            };

            return deferred.promise;
        };
        try {
            dbManager.promises.connect.then(doSelect);
        }
        catch (e) {
            console.log(e, e.stack);
            deferred.reject(new Error('Could not select records', e));
        }

        return deferred.promise;
    };

    /*
     * Public implementation method to select all records from a table
    * @param dbManager {n$.db.Manager} A DB Manager instance
    * @param tableName {String} The name of the table to select from
    */
    var selectAll = function (dbWrapper, tableName) {
        var ret = [];
        var promise = selectAllImpl(dbWrapper, tableName, ret);
        promise.return = ret;
        return promise;
    };

    n$.db.select.register('all', selectAll);
   

    /*
    * Private implementation method to select all records from a table
    * @param dbManager {n$.db.Manager} A DB Manager instance
    * @param tableName {String} The name of the table to select from
    * @param indexName {String} The name of the index to select from
    * @param indexVal {String} The "where" clause: where indexName = indexVal
   */
    var selectFromImpl = function (dbManager, tableName, indexName, indexVal, ret) {
        var deferred = Q.defer();
        var doSelect = function () {
            var transaction = dbManager.getDb().transaction([tableName]);

            var objectStore = transaction.objectStore(tableName);
            var index = objectStore.index(indexName);

            ret = ret || [];
            var keyRange;
            if (indexVal) {
                keyRange = IDBKeyRange.only(indexVal);
            }

            index.openCursor(keyRange).onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    ret.push(cursor.value);
                    cursor.continue();
                } else {
                    deferred.resolve(ret);
                }
            };

            return deferred.promise;
        };
        
        try {
            dbManager.promises.connect.then(doSelect);
        }
        catch (e) {
            console.log(e, e.stack);
            deferred.reject(new Error('Could not select records', e));
        }

        return deferred.promise;
    };

    /*
     * Public implementation method to select all records from a table
    * @param dbManager {n$.db.Manager} A DB Manager instance
    * @param tableName {String} The name of the table to select from
    * @param indexName {String} The name of the index to select from
    * @param indexVal {String} The "where" clause: where indexName = indexVal
    */
    var selectFrom = function (dbWrapper, tableName, indexName, indexVal) {
        var ret = [];
        var promise = selectFromImpl(dbWrapper, tableName, indexName, indexVal, ret);
        promise.return = ret;
        return promise;
    };

    n$.db.select.register('from', selectFrom);


} ());