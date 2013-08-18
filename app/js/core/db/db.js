/*global Q:true */

(function(n$) {

    n$.register('db', n$.makeNameSpace());

    /*
     * Instance a DB Manager class which abstracts the mechanics for connecting to and selecting from an IndexedDb database
     */
    var dbManager = function(name, version) {
        var ret = n$.object();
        ret.add('promises', n$.object());

        var isNewConnectionRequired = false;
        var schemaScripts = [];

        /*
         * Initiate a promise to connect to a database. When that connection is established, the promise will be resolved.
         */
        var connect = function(dbName, dbVersion, dbOnUpgrade) {
            isNewConnectionRequired = (!ret.promises.connect || dbName !== name || dbVersion !== version);
            if (isNewConnectionRequired) {
                var deferred = Q.defer();

                ret.promises.connect = deferred.promise;

                version = dbVersion || 1;
                name = dbName;
                dbOnUpgrade = dbOnUpgrade || function() {};

                var request = window.indexedDB.open(name, version);

                request.onblocked = function(event) {
                    ret.IDB.close();
                    alert("A new version of this page is ready. Please reload!");
                };

                request.onerror = function(event) {
                    deferred.reject(new Error("Database error: " + event.target.errorCode));
                    if (ret.IDB) {
                        ret.IDB.close();
                    }
                };
                request.onsuccess = function(event) {
                    ret.IDB = ret.IDB || request.result;
                    deferred.resolve(ret.IDB);
                };
                request.onupgradeneeded = function(event) {
                    ret.IDB = ret.IDB || request.result;
                    if (schemaScripts.length > 0) {
                        n$.iterate(schemaScripts, function(script) {
                            //debugger;
                            script(ret.IDB);
                        });
                    }
                    dbOnUpgrade(ret.IDB);
                };
            }
            return ret.promises.connect;
        };

        /*
         * Disconnect from a database
         */
        var disconnect = function() {
            if (ret.promises.connect.isFulfilled()) {
                ret.IDB.close();
            }
            else if (ret.IDB) {
                ret.promises.connect.done(ret.IDB.close);
            }
        };

        //Collect the methods into an API:
        ret.add('connect', connect);
        ret.add('disconnect', disconnect);
        ret.add('getDb', function() {
            return ret.IDB;
        });

        ret.add('schemaScripts', schemaScripts);
        ret.add('tables', n$.object());

        ret.add('ddl', {
            createTable: function(tableName, tablePkColumnName, autoIncrement) {
                return n$.fun.shiftRight(n$.db.table.create, ret, arguments, this);
            },
            dropTable: function(tableName) {
                return n$.fun.shiftRight(n$.db.index.drop, ret, arguments, this);
            },
            createIndex: function(tableName, columnName, indexName, isUnique) {
                return n$.fun.shiftRight(n$.db.index.create, ret, arguments, this);
            }
        });

        ret.add('insert', function() {
            return n$.fun.shiftRight(n$.db.insert, ret, arguments, this);
        });

        var select = n$.object();
        ret.add('select', select);

        select.add('all', function() {
            return n$.fun.shiftRight(n$.db.select.all, ret, arguments, this);
        });

        select.add('from', function() {
            return n$.fun.shiftRight(n$.db.select.from, ret, arguments, this);
        });

        //Connect to the DB automatically
        ret.connect(name, version);

        return ret;
    };

    n$.db.register('dbManager', dbManager);

}(window.$nameSpace$));