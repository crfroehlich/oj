((OJ) ->
  'use strict'
  
  #
  #    * Instance a DB Manager class which abstracts the mechanics for connecting to and selecting from an IndexedDb database
  #   
  dbManager = (name, version) ->
    ret = OJ.object()
    ret.add 'promises', OJ.object()
    isNewConnectionRequired = false
    schemaScripts = []
    
    #
    #        * Initiate a promise to connect to a database. When that connection is established, the promise will be resolved.
    #       
    connect = (dbName, dbVersion, dbOnUpgrade) ->
      isNewConnectionRequired = (not ret.promises.connect or dbName isnt name or dbVersion isnt version)
      if isNewConnectionRequired
        deferred = Q.defer()
        ret.promises.connect = deferred.promise
        version = dbVersion or 1
        name = dbName
        dbOnUpgrade = dbOnUpgrade or ->

        request = window.indexedDB.open(name, version)
        request.onblocked = (event) ->
          ret.IDB.close()
          alert 'A new version of this page is ready. Please reload!'
          return

        request.onerror = (event) ->
          deferred.reject new Error('Database error: ' + event.target.errorCode)
          ret.IDB.close()  if ret.IDB
          return

        request.onsuccess = (event) ->
          ret.IDB = ret.IDB or request.result
          deferred.resolve ret.IDB
          return

        request.onupgradeneeded = (event) ->
          ret.IDB = ret.IDB or request.result
          if schemaScripts.length > 0
            OJ.each schemaScripts, (script) ->
              
              #debugger;
              script ret.IDB
              return

          dbOnUpgrade ret.IDB
          return
      ret.promises.connect

    
    #
    #        * Disconnect from a database
    #       
    disconnect = ->
      if ret.promises.connect.isFulfilled()
        ret.IDB.close()
      else ret.promises.connect.done ret.IDB.close  if ret.IDB
      return

    
    #Collect the methods into an API:
    ret.add 'connect', connect
    ret.add 'disconnect', disconnect
    ret.add 'getDb', ->
      ret.IDB

    ret.add 'schemaScripts', schemaScripts
    ret.add 'tables', OJ.object()
    ret.add 'ddl',
      createTable: (tableName, tablePkColumnName, autoIncrement) ->
        OJ.fun.shiftRight OJ.db.table.create, ret, arguments, this

      dropTable: (tableName) ->
        OJ.fun.shiftRight OJ.db.index.drop, ret, arguments, this

      createIndex: (tableName, columnName, indexName, isUnique) ->
        OJ.fun.shiftRight OJ.db.index.create, ret, arguments, this

    ret.add 'insert', ->
      OJ.fun.shiftRight OJ.db.insert, ret, arguments, this

    ret.add 'update', ->
      OJ.fun.shiftRight OJ.db.update, ret, arguments, this

    select = OJ.object()
    ret.add 'select', select
    select.add 'all', ->
      OJ.fun.shiftRight OJ.db.select.all, ret, arguments, this

    select.add 'from', ->
      OJ.fun.shiftRight OJ.db.select.from, ret, arguments, this

    
    #Connect to the DB automatically
    ret.connect name, version
    ret

  OJ.db.register 'dbManager', dbManager
  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ

