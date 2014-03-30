((OJ) ->
  'use strict'
  onError = (eventObj) ->
    OJ.debug.error eventObj.target.error
    new Error(eventObj.target.error)

  
  #
  #   * Private implementation method to insert new records into a table
  #   * @param dbManager {OJ.db.Manager} A DB Manager instance
  #   * @param tableName {String} The name of the table to insert into
  #   * @param records {Array} An Array of records (objects) to insert into the db
  #  
  insertImpl = (dbManager, tableName, records) ->
    deferred = Q.defer()
    doInsert = ->
      try
        transaction = dbManager.getDb().transaction([tableName], "readwrite")
        objectStore = transaction.objectStore(tableName)
        OJ.each records, (rec) ->
          objectStore.add rec
          return

      catch e
        console.log e, e.stack
        deferred.reject new Error("Could not insert records", e)
      deferred.resolve true

    dbManager.promises.connect.then doInsert, ->
      deferred.reject()
      return

    deferred.promise

  
  #
  #    * Public implementation method to insert new records into a table
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance
  #    * @param tableName {String} The name of the table to insert into
  #    * @param records {Array} An Array of records (objects) to insert into the db
  #   
  insert = (dbWrapper, tableName, records) ->
    insertImpl dbWrapper, tableName, records

  OJ.db.register "insert", insert
  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ

