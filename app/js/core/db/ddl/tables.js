/*global Q:true,Faker:true,$nameSpace$: true */

(function(n$) {

    (function () {
    'use strict';
    
    n$.db.register('table', n$.makeNameSpace());
    
    /*
     * Private implementation method to create a new table (aka Object Store). 
     * This works by appending a method to the DB Manager's schema scripts collection, which will be executed on upgrade.
     * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
     * @param dbManager {n$.db.Manager} A DB Manager instance     
     * @param tableName {String} The name of the table (aka Object Store) to create
     * @param tablePkColumnName {String} The name of the column, property or path to property to use as the primary key (e.g. 'customerid' or 'store.orders.customerid').
     * @param autoIncrement {Boolean} [autoIncrement=true] True if the pk index should auto increment
     */
    var createTableImpl = function (deferred, dbManager, tableName, tablePkColumnName, autoIncrement) {
        dbManager.schemaScripts.push(
            /** @param db {IDBDatabase} An IDBDatabase instance*/
            function (db) {
                try {
                    var table = db.createObjectStore(tableName, {
                        keyPath: tablePkColumnName,
                        autoIncrement: false !== autoIncrement
                    });
                    dbManager.tables.add(tableName, table);
                    deferred.resolve(table);
                }
                catch (e) {
                    console.log(e, e.stack);
                    deferred.reject(new Error('Could not create a new table', e));
                }
                return dbManager.tables[tableName];
            });
        return deferred.promise;
    };

    /*
     * Public method to create a new table (aka Object Store).
     * @param dbManager {n$.db.Manager} A DB Manager instance
     * @param db {IDBDatabase} An IDBDatabase instance
     * @param tableName {String} The name of the table (aka Object Store) to create
     * @param tablePkColumnName {String} The name of the column, property or path to property to use as the primary key (e.g. 'customerid' or 'store.orders.customerid').
     * @param autoIncrement {Boolean} [autoIncrement=true] True if the pk index should auto increment
     */
    var createTable = function (dbManager, tableName, tablePkColumnName, autoIncrement) {
        var deferred = Q.defer();
        return createTableImpl(deferred, dbManager, tableName, tablePkColumnName, autoIncrement);
    };

    n$.db.table.register('create', createTable);

    /*
     * Private implementation method to drop a table (aka Object Store). 
     * This works by appending a method to the DB Manager's schema scripts collection, which will be executed on upgrade.
     * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
     * @param dbManager {n$.db.Manager} A DB Manager instance     
     * @param tableName {String} The name of the table (aka Object Store) to drop
     */
    var dropTableImpl = function (deferred, dbManager, tableName) {
        dbManager.schemaScripts.push(
            /** @param db {IDBDatabase} An IDBDatabase instance*/
            function (db) {
                try {
                    db.deleteObjectStore(tableName);
                    delete dbManager.schema[tableName];
                    deferred.resolve();
                }
                catch (e) {
                    console.log(e, e.stack);
                    deferred.reject(new Error('Could not create a new table', e));
                }
                return true;
            });
        return deferred.promise;
    };

    /*
     * Private implementation method to create a new table (aka Object Store).
     * @param dbManager {n$.db.Manager} A DB Manager instance
     * @param db {IDBDatabase} An IDBDatabase instance
     * @param tableName {String} The name of the table (aka Object Store) to drop
     */
    var dropTable = function (dbManager, tableName) {
        var deferred = Q.defer();
        return dropTableImpl(deferred, dbManager, tableName);
    };

    n$.db.table.register('drop', dropTable);


}(window.$nameSpace$));