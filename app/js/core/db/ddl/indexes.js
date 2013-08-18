/*global Q:true,Faker:true,$nameSpace$: true */

(function(n$) {

      n$.db.register('index', n$.makeNameSpace());

    /*
      * Private implementation method to create a new index.
      * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
      * @param dbManager {n$.db.Manager} A DB Manager instance
      * @param tableName {String} The name of the table (aka Object Store) on which to add the index
      * @param columnName {String} The name of the column, property or path to property to index (e.g. 'customerid' or 'store.orders.customerid').
      * @param indexName {String} [indexName=columnName + 'Idx'] The name of the index
      * @param isUnique {Boolean} [isUnique=false] True if a unique constraint should be applied on the property
     */
    var createIndexImpl = function (dbManager, tableName, columnName, indexName, isUnique) {
        var table = dbManager.tables[tableName];
        return table.createIndex(columnName, indexName || columnName + 'Idx', {
            unique: true === isUnique
        });
    };

    /*
     * Public implementation method to create a new index.
     * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
     * @param dbManager {n$.db.Manager} A DB Manager instance
     * @param tableName {String} The name of the table (aka Object Store) on which to add the index
     * @param columnName {String} The name of the column, property or path to property to index (e.g. 'customerid' or 'store.orders.customerid').
     * @param indexName {String} [indexName=columnName + 'Idx'] The name of the index
     * @param isUnique {Boolean} [isUnique=false] True if a unique constraint should be applied on the property
    */
    var createIndex = function (dbManager, tableName, columnName, indexName, isUnique) {
        var deferred = Q.defer();

        dbManager.schemaScripts.push(function () {
            try {
                var index = createIndexImpl(dbManager, tableName, columnName, indexName, isUnique);
                deferred.resolve(index);

            }
            catch (e) {
                console.log(e, e.stack);
                deferred.reject(new Error('Could not create a new index', e));
            }
            return dbManager.tables[tableName];
        });
        return deferred.promise;
    };

    n$.db.index.register('create', createIndex);

}(window.$nameSpace$));