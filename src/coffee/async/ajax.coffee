# # ajax

OJ = require '../oj'

config = {}
  
# define a standard on success handler, write out the request stats to a table
config.onSuccess = (opts, data, url) ->
  response = {}
  OJ.extend response, data
  opts.onSuccess response
  if OJ.LOG_ALL_AJAX
    OJ.console.table [
      Webservice: opts.ajaxOpts.url
      StartTime: opts.startTime
      EndTime: new Date()
    ] 
  return
  
# define a standard on error handler, write out the request error conext to a table
config.onError = (xmlHttpRequest, textStatus, param1, opts = OJ.object()) ->
  if textStatus isnt 'abort'
    if OJ.LOG_ALL_AJAX_ERRORS
      OJ.console.table [
        Webservice: opts.ajaxOpts.url
        Data: opts.ajaxOpts.data
        Failed: textStatus
        State: xmlHttpRequest.state()
        Status: xmlHttpRequest.status
        StatusText: xmlHttpRequest.statusText
        ReadyState: xmlHttpRequest.readyState
        ResponseText: xmlHttpRequest.responseText
      ]

    opts.onError textStatus
  return
  
# in the case where `opts` is a string, convert it to an object
optsFromUrl = (opts) ->
  if OJ.is.string opts
    url = opts
    opts = OJ.object()
    opts.add 'ajaxOpts', OJ.object()
    opts.ajaxOpts.add 'url', url
  opts
  
# define a standard `exec` method to handle all request verbs. Uses the [jQuery.ajax](http://api.jquery.com/category/ajax/) API.
# `execRequest` returns a promise represent the actual AJAX call.
  
# - `verb` default value = 'GET'
# - `opts` object
# -- `opts.ajaxOpts` object for all jQuery's ajax-specific properties.
config.execRequest = (verb = 'GET', opts) ->
  defaults =
    ajaxOpts:
      url: ''
      data: {}
      type: verb
      xhrFields:
        withCredentials: true
      dataType: 'json'
      contentType: 'application/json; charset=utf-8'
        
    onSuccess: OJ.noop
    onError: OJ.noop
    onComplete: OJ.noop
    overrideError: false
    watchGlobal: true
    useCache: false
    
  opts = optsFromUrl opts
  OJ.extend defaults, opts, true
    
  defaults.startTime = new Date()
    
  if false is OJ.is.nullOrEmpty defaults.ajaxOpts.data
    # GET requests expect queryString parameters
    if defaults.ajaxOpts.verb is 'GET'
      defaults.ajaxOpts.data = OJ.params defaults.ajaxOpts.data
    # all other requests take an object
    else
      defaults.ajaxOpts.data = OJ.serialize defaults.ajaxOpts.data
    
  getJQueryDeferred = (watchGlobal) ->
    ret = $.ajax defaults.ajaxOpts
      
    ret.done (data, textStatus, jqXHR) ->
      config.onSuccess defaults, data

    ret.fail (jqXHR, textStatus, errorText) ->
      config.onError jqXHR, textStatus, errorText, defaults
  
    ret.always (xmlHttpRequest, textStatus) ->
      defaults.onComplete xmlHttpRequest, textStatus

    OJ.async.ajaxPromise ret

  promise = getJQueryDeferred(defaults.watchGlobal)
  promise
  
ajax = {}
  
# ## post
# [OJ](oj.html).ajax.post: insert a new object or init a form post
  
# - `opts` can be an object representing the configuration of the request.
# - `opts` can also be a string, representing the URL to hit. 
ajax.post = (opts) ->
  config.execRequest 'POST', opts
  
# ## get
# [OJ](oj.html).ajax.get: get an existing object
  
# - `opts` can be an object representing the configuration of the request.
# - `opts` can also be a string, representing the URL to hit.
#
ajax.get = (opts) ->
  config.execRequest 'GET', opts

# ## delete
# [OJ](oj.html).ajax.delete: delete an existing object
  
# - `opts` can be an object representing the configuration of the request.
# - `opts` can also be a string, representing the URL to hit.
ajax.delete = (opts) ->
  config.execRequest 'DELETE', opts

# ## put
# [OJ](oj.html).ajax.put: update an existing object
  
# - `opts` can be an object representing the configuration of the request.
# - `opts` can also be a string, representing the URL to hit.
ajax.put = (opts) ->
  config.execRequest 'PUT', opts

OJ.async.register 'ajax', ajax
module.exports = ajax