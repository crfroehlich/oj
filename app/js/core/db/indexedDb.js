/*global Q:true,Faker:true */

(function(n$) {

    n$.makeSubNameSpace('db');

    // Enable long stack traces across the promise. ONLY USE IN DEBUGGING!
    // Q.longStackSupport = true;

    /*
     * Instance a DB Manager class which abstracts the mechanics for connecting to and selecting from an IndexedDb database
    */
    var dbManager = function() {
        var name, version, db, connectPromise, upgradeIsRequired = false;
        var schemaScripts = [];

        /*
         * Initiate a promise to connect to a database. When that connection is established, the promise will be resolved.
        */
        var connect = function(dbName, dbVersion, dbOnUpgrade) {
            upgradeIsRequired = (!connectPromise || dbName !== name || dbVersion !== version);
            if (upgradeIsRequired) {
                var deferred = Q.defer();

                connectPromise = deferred.promise;

                version = dbVersion || 1;
                name = dbName;
                dbOnUpgrade = dbOnUpgrade || function() {};

                var request = window.indexedDB.open(name, version);

                request.onblocked = function(event) {
                    db.close();
                    alert("A new version of this page is ready. Please reload!");
                };

                request.onerror = function(event) {
                    deferred.reject(new Error("Database error: " + event.target.errorCode));
                    if (db) {
                        db.close();
                    }
                };
                request.onsuccess = function(event) {
                    db = request.result;
                    deferred.resolve(db);
                };
                request.onupgradeneeded = function(event) {
                    if (schemaScripts.length > 0) {
                        n$.each(schemaScripts, function(script) {
                            //debugger;
                            script(db);
                        });
                    }
                    dbOnUpgrade(db);
                };
            }
            return connectPromise;
        };

        /*
         * Disconnect from a database
        */
        var disconnect = function() {
            if (connectPromise.isFulfilled()) {
                db.close();
            }
            else if (db) {
                connectPromise.done(db.close);
            }
        };

       /* var createTableImpl = function(dbWrapper, db, tableName, tablePkColumnName, autoIncrement) {
            var table = db.createObjectStore(tableName, {
                keyPath: tablePkColumnName,
                autoIncrement: false !== autoIncrement
            });
            dbWrapper.schema.add(tableName, table);
            return table;
        };

        var createTable = function(dbWrapper, tableName, tablePkColumnName, autoIncrement) {
            var deferred = Q.defer();
            schemaScripts.push(function(db) {
                try {
                    var objectStore = createTableImpl(dbWrapper, db, tableName, tablePkColumnName, autoIncrement);
                    deferred.resolve(objectStore);

                }
                catch (e) {
                    console.log(e, e.stack);
                    deferred.reject(new Error('Could not create a new table', e));
                }
                return dbWrapper.schema[tableName];
            });
            return deferred.promise;
        };*/

        /*var createIndexImpl = function(dbWrapper, tableName, columnName, indexName, isUnique) {
            var table = dbWrapper.schema[tableName];
            return table.createIndex(columnName, indexName || columnName + 'Idx', {
                unique: true === isUnique
            });
        };

        var createIndex = function(dbWrapper, tableName, columnName, indexName, isUnique) {
            var deferred = Q.defer();

            schemaScripts.push(function() {
                try {
                    var index = createIndexImpl(dbWrapper, tableName, columnName, indexName, isUnique);
                    deferred.resolve(index);

                }
                catch (e) {
                    console.log(e, e.stack);
                    deferred.reject(new Error('Could not create a new index', e));
                }
                return dbWrapper.schema[tableName];
            });
            return deferred.promise;
        };*/

        /*var insertImpl = function(tableName, records) {
            var deferred = Q.defer();

            try {
                var transaction = db.transaction([tableName], 'readwrite');

                var objectStore = transaction.objectStore(tableName);
                n$.each(records, function(rec) {
                    objectStore.add(rec);
                });

                deferred.resolve(true);
            }
            catch (e) {
                console.log(e, e.stack);
                deferred.reject(new Error('Could not insert records', e));
            }

            return deferred.promise;
        };

        var insert = function(dbWrapper, tableName, records) {
            var ret = function() {
                if (!dbWrapper.db) {
                    dbWrapper.add('db', db);
                }
                return insertImpl(tableName, records);
            };
            if (db || connectPromise.isResolved()) {
                ret();
            }
            else {
                connectPromise.then(ret);
            }
            //return ret.promise;
        };*/

        var ret = n$.object();
        ret.add('connect', connect);
        ret.add('disconnect', disconnect);
        ret.add('getDb', function() { return db; });
        
        ret.add('schemaScripts', schemaScripts);
        ret.add('tables', n$.object());
        
        ret.add('promises', n$.object());
        ret.promises.add('connect', connectPromise);
        
        ret.add('ddl', {
            createTable: function(tableName, tablePkColumnName, autoIncrement) {
                return n$.shiftRight(n$.db.table.create, ret, arguments, this);
                /*
                var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(ret);
				return createTable.apply(this, args);*/
            },
            dropTable: function(tableName) {
                return n$.shiftRight(n$.db.index.drop, ret, arguments, this);
                /*var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(ret);
				return createTable.apply(this, args);*/
            },
            createIndex: function(tableName, columnName, indexName, isUnique) {
                return n$.shiftRight(n$.db.index.create, ret, arguments, this);
                /*var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(ret);
				return createIndex.apply(this, args);*/
            }
        });
        ret.add('insert', function() {
            return n$.shiftRight(n$.db.insert, ret, arguments, this);
            /*var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(ret);
            return insert.apply(this, args);*/
        });
        return ret;
    };

    n$.db.register('dbManager', dbManager);

}(window.$nameSpace$));