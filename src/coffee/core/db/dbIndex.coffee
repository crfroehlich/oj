(->
  'use strict'
  
  #
  #     * Private implementation method to create a new index.
  #     * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
  #     * @param dbManager {OJ.db.Manager} A DB Manager instance
  #     * @param tableName {String} The name of the table (aka Object Store) on which to add the index
  #     * @param columnName {String} The name of the column, property or path to property to index (e.g. 'customerid' or 'store.orders.customerid').
  #     * @param indexName {String} [indexName=columnName + 'Idx'] The name of the index
  #     * @param isUnique {Boolean} [isUnique=false] True if a unique constraint should be applied on the property
  #    
  createIndexImpl = (dbManager, tableName, columnName, indexName, isUnique) ->
    table = dbManager.tables[tableName]
    table.createIndex columnName, indexName or columnName + "Idx",
      unique: true is isUnique


  
  #
  #    * Public implementation method to create a new index.
  #    * TODO: This (and other) DDL ops assumes that version management is handled elsewhere. Probably need to come up with a scipt-to-version mapper.
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance
  #    * @param tableName {String} The name of the table (aka Object Store) on which to add the index
  #    * @param columnName {String} The name of the column, property or path to property to index (e.g. 'customerid' or 'store.orders.customerid').
  #    * @param indexName {String} [indexName=columnName + 'Idx'] The name of the index
  #    * @param isUnique {Boolean} [isUnique=false] True if a unique constraint should be applied on the property
  #   
  createIndex = (dbManager, tableName, columnName, indexName, isUnique) ->
    deferred = Q.defer()
    dbManager.schemaScripts.push ->
      try
        index = createIndexImpl(dbManager, tableName, columnName, indexName, isUnique)
        deferred.resolve index
      catch e
        console.log e, e.stack
        deferred.reject new Error("Could not create a new index", e)
      dbManager.tables[tableName]

    deferred.promise

  OJ.db.index.register "create", createIndex
  return
)()
