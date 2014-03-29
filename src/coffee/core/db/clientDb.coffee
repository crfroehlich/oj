(->
  'use strict'
  cacheDbMgr = null
  thisCustomerId = ""
  thisUserName = ""
  
  ###
  All paramaters are required
  ###
  validate = (customerId, userName, webServiceName) ->
    thisCustomerId = customerId or (thisCustomerId = OJ.session.currentAccessId())
    thisUserName = userName or (thisUserName = OJ.session.currentUserName())
    throw new Error("Customer ID is required.")  unless thisCustomerId
    throw new Error("User Name is required.")  unless thisUserName
    throw new Error("Web Service Name is required.")  unless webServiceName
    return

  
  ###
  Make a cached call for insert
  ###
  makeCachedCall = (webServiceName, data) ->
    message:
      dateTime: new Date()
      cache:
        customerId: thisCustomerId
        userName: thisUserName
        webServiceName: webServiceName

      data: data

  getCachedWebServiceCall = (webServiceName, customerId, userName) ->
    deferred = Q.defer()
    ret = undefined
    customerId = customerId or thisCustomerId
    userName = userName or thisUserName
    if null is cacheDbMgr
      deferred.resolve OJ.object()
      ret = deferred.promise
    else
      validate customerId, userName, webServiceName
      promise = cacheDbMgr.select.from("CachedData", "uniqueCalls", [
        webServiceName
        thisUserName
        thisCustomerId
      ])
      ret = promise.then((data) ->
        
        #This is a bit of a dance, but promises are promises.
        #We want the return promise to massage the data into the right object, 
        #so what is one more promise between friends?
        data[0].data  if data and data.length > 0
      )
    ret

  OJ.register "getCachedWebServiceCall", getCachedWebServiceCall
  setCachedWebServiceCall = (webServiceName, data, customerId, userName) ->
    deferred = Q.defer()
    customerId = customerId or thisCustomerId
    userName = userName or thisUserName
    ret = undefined
    if null is cacheDbMgr
      deferred.resolve OJ.object()
      ret = deferred.promise
    else
      validate customerId, userName, webServiceName
      ret = cacheDbMgr.update("CachedData", "uniqueCalls", [
        webServiceName
        thisUserName
        thisCustomerId
      ],
        data: data
      )
      ret.then (updatedRows) ->
        if not updatedRows or updatedRows.length is 0
          cachedCall = makeCachedCall(webServiceName, data)
          cacheDbMgr.insert "CachedData", cachedCall

    ret

  OJ.register "setCachedWebServiceCall", setCachedWebServiceCall
  cacheExists = ->
    cacheDbMgr isnt `undefined`

  OJ.register "cacheExists", cacheExists
  
  #Wait until Main is loaded before initing
  OJ.main.onReady.then ->
    thisCustomerId = OJ.session.currentAccessId() or "offline"
    thisUserName = OJ.session.currentUserName() or "offline"
    if window.Modernizr.indexeddb and false is OJ.browserCompatibility.usingIE10() #case 30642: brutal hack to get around IE 10's partial IndexedDB implementation
      #Until we need to manage versions, there is only 1. Versioning either happens on connection, or it doesn't.
      cacheDbMgr = OJ.db.dbManager("OJLive", 1)
      
      #newDbMgr.ddl.dropTable(tableName);
      cacheDbMgr.ddl.createTable "CachedData", "CachedDataId", true #true == auto manage primary key
      cacheDbMgr.ddl.createIndex "CachedData", "customerId", "cache.customerId"
      cacheDbMgr.ddl.createIndex "CachedData", "dateTimeId", "dateTime"
      cacheDbMgr.ddl.createIndex "CachedData", "userNameId", "cache.userName"
      cacheDbMgr.ddl.createIndex "CachedData", "webServiceNameId", "cache.webServiceName"
      cacheDbMgr.ddl.createIndex "CachedData", "uniqueCalls", [
        "cache.webServiceName"
        "cache.userName"
        "cache.customerId"
      ], true
    return

  return

#Insert some demo data
#cacheDbMgr.insert('CachedData', { message: { dateTime: new Date(), cache: { customerId: 'dev', userName: 'admin', webServiceName: 'getDashbaord' }, data: { a: 1, b: 2, c: 3 } } });
#cacheDbMgr.insert('CachedData', { message: { dateTime: new Date(), cache: { customerId: 'qa', userName: 'bill', webServiceName: 'getWatermark' }, data: { a: 1, b: 2, c: 3 } } });
)()
