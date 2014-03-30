((OJ) ->
  'use strict'
  
  OJ.db.makeSubNameSpace 'table'
  
  #
  #    * Private implementation method to create a new table (aka Object Store). 
  #    * This works by appending a method to the DB Manager's schema scripts collection, which will be executed on upgrade.
  #    * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance     
  #    * @param tableName {String} The name of the table (aka Object Store) to create
  #    * @param tablePkColumnName {String} The name of the column, property or path to property to use as the primary key (e.g. 'customerid' or 'store.orders.customerid').
  #    * @param autoIncrement {Boolean} [autoIncrement=true] True if the pk index should auto increment
  #    
  createTableImpl = (deferred, dbManager, tableName, tablePkColumnName, autoIncrement) ->
    
    ###
    @param db {IDBDatabase} An IDBDatabase instance
    ###
    dbManager.schemaScripts.push (db) ->
      try
        table = db.createObjectStore(tableName,
          keyPath: tablePkColumnName
          autoIncrement: false isnt autoIncrement
        )
        dbManager.tables.add tableName, table
        deferred.resolve table
      catch e
        console.log e, e.stack
        deferred.reject new Error("Could not create a new table", e)
      dbManager.tables[tableName]

    deferred.promise

  
  #
  #    * Public method to create a new table (aka Object Store).
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance
  #    * @param db {IDBDatabase} An IDBDatabase instance
  #    * @param tableName {String} The name of the table (aka Object Store) to create
  #    * @param tablePkColumnName {String} The name of the column, property or path to property to use as the primary key (e.g. 'customerid' or 'store.orders.customerid').
  #    * @param autoIncrement {Boolean} [autoIncrement=true] True if the pk index should auto increment
  #    
  createTable = (dbManager, tableName, tablePkColumnName, autoIncrement) ->
    deferred = Q.defer()
    createTableImpl deferred, dbManager, tableName, tablePkColumnName, autoIncrement

  OJ.db.table.register "create", createTable
  
  #
  #    * Private implementation method to drop a table (aka Object Store). 
  #    * This works by appending a method to the DB Manager's schema scripts collection, which will be executed on upgrade.
  #    * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance     
  #    * @param tableName {String} The name of the table (aka Object Store) to drop
  #    
  dropTableImpl = (deferred, dbManager, tableName) ->
    
    ###
    @param db {IDBDatabase} An IDBDatabase instance
    ###
    dbManager.schemaScripts.push (db) ->
      try
        db.deleteObjectStore tableName
        delete dbManager.schema[tableName]

        deferred.resolve()
      catch e
        console.log e, e.stack
        deferred.reject new Error("Could not create a new table", e)
      true

    deferred.promise

  
  #
  #    * Private implementation method to create a new table (aka Object Store).
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance
  #    * @param db {IDBDatabase} An IDBDatabase instance
  #    * @param tableName {String} The name of the table (aka Object Store) to drop
  #    
  dropTable = (dbManager, tableName) ->
    deferred = Q.defer()
    dropTableImpl deferred, dbManager, tableName

  OJ.db.table.register "drop", dropTable
  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ

