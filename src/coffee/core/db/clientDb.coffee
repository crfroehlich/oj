((OJ) ->
  'use strict'
  cacheDbMgr = null
  thisUserName = ''
  
  ###
  All paramaters are required
  ###
  validate = (userName, webServiceName) ->
    thisUserName = userName or thisUserName
    throw new Error('User Name is required.')  unless thisUserName
    throw new Error('Web Service Name is required.')  unless webServiceName
    return

  
  ###
  Make a cached call for insert
  ###
  makeCachedCall = (webServiceName, data) ->
    message:
      dateTime: new Date()
      cache:
        userName: thisUserName
        webServiceName: webServiceName

      data: data

  getCachedResponse = (webServiceName, userName) ->
    deferred = Q.defer()
    ret = undefined
    userName = userName or thisUserName
    if null is cacheDbMgr
      deferred.resolve OJ.object()
      ret = deferred.promise
    else
      validate userName, webServiceName
      promise = cacheDbMgr.select.from('CachedData', 'uniqueCalls', [
        webServiceName
        thisUserName
      ])
      ret = promise.then((data) ->
        
        #This is a bit of a dance, but promises are promises.
        #We want the return promise to massage the data into the right object, 
        #so what is one more promise between friends?
        data[0].data  if data and data.length > 0
      )
    ret

  OJ.register 'getCachedResponse', getCachedResponse
  setCachedWebResponse = (webServiceName, data, customerId, userName) ->
    deferred = Q.defer()
    customerId = customerId or thisCustomerId
    userName = userName or thisUserName
    ret = undefined
    if null is cacheDbMgr
      deferred.resolve OJ.object()
      ret = deferred.promise
    else
      validate customerId, userName, webServiceName
      ret = cacheDbMgr.update('CachedData', 'uniqueCalls', [
        webServiceName
        thisUserName
        thisCustomerId
      ],
        data: data
      )
      ret.then (updatedRows) ->
        if not updatedRows or updatedRows.length is 0
          cachedCall = makeCachedCall(webServiceName, data)
          cacheDbMgr.insert 'CachedData', cachedCall

    ret

  OJ.register 'setCachedWebResponse', setCachedWebResponse
  cacheExists = ->
    cacheDbMgr isnt `undefined`

  OJ.register 'cacheExists', cacheExists
  
  #Wait until Main is loaded before initing
  OJ.register 'initDb', (userName = 'offline') ->
    thisUserName = userName
    if window.Modernizr.indexeddb 
      cacheDbMgr = OJ.db.dbManager('ojdb', 1)
      
      #newDbMgr.ddl.dropTable(tableName);
      cacheDbMgr.ddl.createTable 'CachedData', 'CachedDataId', true #true == auto manage primary key
      cacheDbMgr.ddl.createIndex 'CachedData', 'dateTimeId', 'dateTime'
      cacheDbMgr.ddl.createIndex 'CachedData', 'userNameId', 'cache.userName'
      cacheDbMgr.ddl.createIndex 'CachedData', 'webServiceNameId', 'cache.webServiceName'
      cacheDbMgr.ddl.createIndex 'CachedData', 'uniqueCalls', [
        'cache.webServiceName'
        'cache.userName'
      ], true
    return

  return

#Insert some demo data
#cacheDbMgr.insert('CachedData', { message: { dateTime: new Date(), cache: { customerId: 'dev', userName: 'admin', webServiceName: 'getDashbaord' }, data: { a: 1, b: 2, c: 3 } } });
#cacheDbMgr.insert('CachedData', { message: { dateTime: new Date(), cache: { customerId: 'qa', userName: 'bill', webServiceName: 'getWatermark' }, data: { a: 1, b: 2, c: 3 } } });
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ

