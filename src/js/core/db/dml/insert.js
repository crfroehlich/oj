/*global Q:true,Faker:true,$nameSpace$: true */

(function(n$) {

    /*
    * Private implementation method to insert new records into a table
    * @param dbManager {n$.db.Manager} A DB Manager instance
    * @param tableName {String} The name of the table to insert into
    * @param records {Array} An Array of records (objects) to insert into the db
   */
    var insertImpl = function (dbManager, tableName, records) {
        var deferred = Q.defer();
        var doInsert = function () {
            var transaction = dbManager.getDb().transaction([tableName], 'readwrite');

            var objectStore = transaction.objectStore(tableName);
            n$.iterate(records, function (rec) {
                objectStore.add(rec);
            });

            return deferred.resolve(true);
        };
        try {
            dbManager.promises.connect.then(doInsert);
        }
        catch (e) {
            console.log(e, e.stack);
            deferred.reject(new Error('Could not insert records', e));
        }

        return deferred.promise;
    };

    /*
     * Private implementation method to insert new records into a table
     * @param dbManager {n$.db.Manager} A DB Manager instance
     * @param tableName {String} The name of the table to insert into
     * @param records {Array} An Array of records (objects) to insert into the db
    */
    var insert = function (dbWrapper, tableName, records) {
        return insertImpl(dbWrapper, tableName, records);
    };

    n$.db.register('insert', insert);

}(window.$nameSpace$));