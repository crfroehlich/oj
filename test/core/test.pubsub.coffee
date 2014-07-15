do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'pubSub'
  
  asyncTest 'Test pubsub', ->
    expect 1
    
    method = () ->
      ok true, 'Event was successfully called'
      start()
      
    OJ.subscribe 'PubSub Test', method
    OJ.publish 'PubSub Test'  
    
    return
  
  return
  

