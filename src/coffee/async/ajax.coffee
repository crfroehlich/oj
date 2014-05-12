((OJ) ->

  config = {}
  config.onSuccess = (opts, data, url) ->
    response = {}
    OJ.extend response, data, true
    opts.onSuccess response
    OJ.console.table [
      Webservice: opts.ajaxOpts.url
      StartTime: opts.startTime
      EndTime: new Date()
    ] 
    return
  
  config.onError = (xmlHttpRequest, textStatus, param1, opts = OJ.object()) ->
    if textStatus isnt 'abort'
      OJ.console.table [
        Webservice: opts.ajaxOpts.url
        data: opts.ajaxOpts.data
        Failed: textStatus
        state: xmlHttpRequest.state()
        status: xmlHttpRequest.status
        statusText: xmlHttpRequest.statusText
        readyState: xmlHttpRequest.readyState
        responseText: xmlHttpRequest.responseText
        ]

      opts.onError textStatus
    return
  
  optsFromUrl = (opts) ->
    if OJ.is.string opts
      url = opts
      opts = OJ.object()
      opts.add 'ajaxOpts', OJ.object()
      opts.ajaxOpts.add 'url', url
    opts
  
  config.execRequest = (verb = 'GET', opts) ->
    defaults =
      ajaxOpts:
        url: ''
        data: {}
        type: verb
        url: defaults.url
        xhrFields:
          withCredentials: true
        dataType: 'json'
        contentType: 'application/json; charset=utf-8'
        data: defaults.data
        watchGlobal: false isnt watchGlobal
        
      onSuccess: _.noop
      onError: _.noop
      onComplete: _.noop
      overrideError: false
      watchGlobal: true
      useCache: false
    
    opts = optsFromUrl opts
    OJ.extend defaults, opts
    
    defaults.startTime = new Date()
    
    if false is OJ.is.nullOrEmpty defaults.ajaxOpts.data
      if verb is 'GET'
        defaults.ajaxOpts.data = OJ.params defaults.ajaxOpts.data
      else
        defaults.ajaxOpts.data = OJ.serialize defaults.ajaxOpts.data
    
    getPromiseFromAjax = (watchGlobal) ->
      ret = $.ajax defaults.ajaxOpts
      
      ret.done (data, textStatus, jqXHR) ->
        config.onSuccess defaults, data

      ret.fail (jqXHR, textStatus, errorText) ->
        config.onError jqXHR, textStatus, errorText, defaults
  
      ret.always (xmlHttpRequest, textStatus) ->
        defaults.onComplete xmlHttpRequest, textStatus

      OJ.async.ajaxPromise ret

    promise = undefined
    if true is defaults.useCache
      #fetch last known result from cache
    else
      promise = getPromiseFromAjax(defaults.watchGlobal)
    promise
  
  ajax = {}
  ajax.post = (opts) ->
    config.execRequest 'POST', opts
  
  ajax.get = (opts) ->
    config.execRequest 'GET', opts

  ajax.delete = (opts) ->
    config.execRequest 'DELETE', opts

  ajax.put = (opts) ->
    config.execRequest 'PUT', opts

  OJ.async.register 'ajax', ajax

  return

  return
  
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ