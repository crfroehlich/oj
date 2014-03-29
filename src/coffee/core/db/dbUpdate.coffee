(->
  'use strict'
  onError = (eventObj) ->
    OJ.debug.error eventObj.target.error
    new Error(eventObj.target.error)

  
  #
  #   * Private implementation method to update new records into a table
  #   * @param dbManager {OJ.db.Manager} A DB Manager instance
  #   * @param tableName {String} The name of the table to update into
  #   * @param indexName {String} The name of the index to select from
  #   * @param indexVal {String} The "where" clause: where indexName = indexVal
  #   * @param record {Object} An object to update/insert into the db
  #  
  updateImpl = (dbManager, tableName, indexName, indexVal, ret, record) ->
    deferred = Q.defer()
    doUpdate = ->
      try
        transaction = dbManager.getDb().transaction([tableName], "readwrite")
        objectStore = transaction.objectStore(tableName)
        index = objectStore.index(indexName)
        ret = ret or []
        keyRange = IDBKeyRange.only(indexVal)
        selRequest = index.openCursor(keyRange)
        selRequest.onsuccess = (event) ->
          cursor = event.target.result
          if cursor
            val = cursor.value
            newRec = OJ.extend(val, record)
            updtRequest = cursor.update(newRec)
            updtRequest.onerror = onError
          else
            deferred.resolve ret
          return

        selRequest.onerror = (e) ->
          deferred.reject onError(e)
          return
      catch e
        console.log e, e.stack
        deferred.reject new Error("Could not select records", e)
      deferred.promise

    dbManager.promises.connect.then doUpdate, ->
      deferred.reject()
      return

    deferred.promise

  
  #
  #    * Public implementation method to update (or insert new) record into a table
  #    * @param dbManager {OJ.db.Manager} A DB Manager instance
  #    * @param tableName {String} The name of the table to update into
  #    * @param indexName {String} The name of the index to select from
  #    * @param indexVal {String} The "where" clause: where indexName = indexVal
  #    * @param record {Object} An object to update/insert into the db
  #   
  OJ.db.register "update", update = (dbWrapper, tableName, indexName, indexVal, record) ->
    ret = []
    updateImpl dbWrapper, tableName, indexName, indexVal, ret, record

  return
)()
