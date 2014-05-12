((OJ) ->

  config = {}
  config.onSuccess = (opts, data, url) ->
    response = {}
    OJ.extend response, data, true
    #exec success method    
    return
  
  config.onError = (xmlHttpRequest, textStatus, param1, opts = OJ.object()) ->
    if textStatus isnt 'abort'
      OJ.console.table
        Webservice: opts.url
        data: opts.data
        Failed: textStatus
        state: xmlHttpRequest.state()
        status: xmlHttpRequest.status
        statusText: xmlHttpRequest.statusText
        readyState: xmlHttpRequest.readyState
        responseText: xmlHttpRequest.responseText

      opts.error textStatus
    return
  
  config.execRequest = (verb = 'GET', opts = OJ.object()) ->
    defaults =
      url: ''
      data: {}
      success: _.noop
      error: _.noop
      complete: _.noop
      overrideError: false
      watchGlobal: true
      useCache: false
    
    OJ.extend defaults, opts
    
    defaults.startTime = new Date()
    
    if false is OJ.is.nullOrEmpty(defaults.data)
      if verb is 'GET'
        defaults.data = OJ.params(defaults.data)
      else
        defaults.data = OJ.serialize(defaults.data)
    
    getPromiseFromAjax = (watchGlobal) ->
      ret = $.ajax
        type: verb
        url: defaults.url
        xhrFields:
          withCredentials: true

        dataType: 'json'
        contentType: 'application/json; charset=utf-8'
        data: defaults.data
        watchGlobal: false isnt watchGlobal
      
      ret.done (data, textStatus, jqXHR) ->
        config.onSuccess defaults, data, defaults.url

      ret.fail (jqXHR, textStatus, errorText) ->
        config.onError jqXHR, textStatus, errorText,
          data: defaults.data
          watchGlobal: defaults.watchGlobal
          urlMethod: document.location + '/' + defaults.url


      ret.always (xmlHttpRequest, textStatus) ->
        defaults.complete xmlHttpRequest, textStatus

      OJ.async.ajaxPromise ret

    promise = undefined
    if true is defaults.useCache
      #fetch last known result from cache
    else
      promise = getPromiseFromAjax(defaults.watchGlobal)
    promise
  
  
  ajax = {}
  ajax.post = (opts, type) ->
    config.execRequest 'POST', opts
  
  ajax.get = (opts, type) ->
    config.execRequest 'GET', opts

  ajax.delete = (opts, type) ->
    config.execRequest 'DELETE', opts

  ajax.put = (opts, type) ->
    config.execRequest 'PUT', opts

  OJ.async.register 'ajax', ajax

  return

  return
  
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ