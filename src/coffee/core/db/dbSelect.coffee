((OJ) ->
  
  OJ.db.makeSubNameSpace 'select'
  
  onError = (eventObj) ->
    OJ.debug.error eventObj.target.error
    new Error(eventObj.target.error)

  
  #
  #        * Private implementation method to select all records from a table
  #        * @param dbManager {OJ.db.Manager} A DB Manager instance
  #        * @param tableName {String} The name of the table to select from
  #       
  selectAllImpl = (dbManager, tableName, ret) ->
    deferred = Q.defer()
    doSelect = ->
      try
        transaction = dbManager.getDb().transaction([tableName])
        objectStore = transaction.objectStore(tableName)
        ret = ret or []
        selRequest = objectStore.openCursor()
        selRequest.onsuccess = (event) ->
          cursor = event.target.result
          if cursor
            ret.push cursor.value
            cursor['continue']()
          else
            deferred.resolve ret
          return

        selRequest.onerror = (eventObj) ->
          deferred.reject onError(eventObj)
          return
      catch e
        console.log e, e.stack
        deferred.reject new Error('Could not select records', e)
      deferred.promise

    dbManager.promises.connect.then doSelect, ->
      deferred.reject()
      return

    deferred.promise

  
  #
  #         * Public implementation method to select all records from a table
  #        * @param dbManager {OJ.db.Manager} A DB Manager instance
  #        * @param tableName {String} The name of the table to select from
  #        
  selectAll = (dbWrapper, tableName) ->
    ret = []
    promise = selectAllImpl(dbWrapper, tableName, ret)
    promise['return'] = ret
    promise

  OJ.db.select.register 'all', selectAll
  
  #
  # * Private implementation method to select all records from a table
  # * @param dbManager {OJ.db.Manager} A DB Manager instance
  # * @param tableName {String} The name of the table to select from
  # * @param indexName {String} The name of the index to select from
  # * @param indexVal {String} The 'where' clause: where indexName = indexVal
  #
  selectFromImpl = (dbManager, tableName, indexName, indexVal, ret) ->
    deferred = Q.defer()
    doSelect = ->
      try
        transaction = dbManager.getDb().transaction([tableName])
        objectStore = transaction.objectStore(tableName)
        index = objectStore.index(indexName)
        ret = ret or []
        keyRange = undefined
        keyRange = IDBKeyRange.only(indexVal)  if indexVal
        selRequest = index.openCursor(keyRange)
        selRequest.onsuccess = (event) ->
          cursor = event.target.result
          if cursor
            ret.push cursor.value
            cursor['continue']()
          else
            deferred.resolve ret
          return

        selRequest.onerror = (eventObj) ->
          deferred.reject onError(eventObj)
          return
      catch e
        console.log e, e.stack
        deferred.reject new Error('Could not select records', e)
      deferred.promise

    dbManager.promises.connect.then doSelect, ->
      deferred.reject()
      return

    deferred.promise

  
  #
  # * Public implementation method to select all records from a table
  # * @param dbManager {OJ.db.Manager} A DB Manager instance
  # * @param tableName {String} The name of the table to select from
  # * @param indexName {String} The name of the index to select from
  # * @param indexVal {String} The 'where' clause: where indexName = indexVal
  # 
  OJ.db.select.register 'from', selectFrom = (dbWrapper, tableName, indexName, indexVal) ->
    ret = []
    promise = selectFromImpl(dbWrapper, tableName, indexName, indexVal, ret)
    promise['return'] = ret
    promise

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
