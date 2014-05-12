((OJ) ->

  OJ.async.register 'ajaxPromise', (ajax) -> 
    promise = Q.when(ajax)
    promise.abort = ajax.abort
    promise.readyState = ajax.readyState
    promise

  OJ.async.register 'all', (initArray) ->
    reqs = initArray or []
    promise = Q.all(reqs)
    promise.push = (item) ->
      reqs.push item
      return
    promise

  OJ.async.register 'defer', () ->
    ret = Q.defer()
    ret

  return
  
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ