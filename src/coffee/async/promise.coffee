# # promise

((OJ) ->

  # ## ajaxPromise
  # `[OJ](oj.html).async.ajaxPromise` converts an AJAX XmlHttpRequest into a Promise. 
  # See also (Q.when)[https://github.com/kriskowal/q#the-middle].
  OJ.async.register 'ajaxPromise', (ajax) -> 
    promise = Q.when(ajax)
    promise.abort = ajax.abort
    promise.readyState = ajax.readyState
    promise

  # ## all
  # `[OJ](oj.html).async.all` takes an array of functions and returns a promise representing the success of all methods or the failure of any method.
  # See also (Q.all)[https://github.com/kriskowal/q#combination].
  OJ.async.register 'all', (initArray) ->
    reqs = initArray or []
    promise = Q.all(reqs)
    promise.push = (item) ->
      reqs.push item
      return
    promise

  # ## defer
  # `[OJ](oj.html).async.defer` converts a function into a Promise to execute that function. 
  # See also (Q.fcall)[https://github.com/kriskowal/q#using-qfcall].
  OJ.async.register 'defer', (func = OJ.noop) ->
    ret = Q.fcall func
    ret
  
  # ## promise
  # `[OJ](oj.html).async.promise` create a new promise based on an existing deferred. 
  # See also (Q.defer)[https://github.com/kriskowal/q#using-deferreds].   
  OJ.async.register 'promise', (deferred = Q.defer()) ->
    if deferred and deferred.promise
      ret = deferred.promise
    

  return
  
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ