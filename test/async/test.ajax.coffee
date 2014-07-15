do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'ajax'
  
  asyncTest 'Test ajax promises', ->
    expect 1
    
    OJ.async.ajax.get 'async/test.ajax.json'
      .then ->
        ok true, 'Event was successfully called'
        start()
      .catch ->
        deepEqual NaN, true, 'Event failed'
    
    return
  
  return
  

