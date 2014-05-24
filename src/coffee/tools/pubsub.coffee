((OJ) ->
  
  tokens = {}
  subscribers = []
  events = {}
  
  getEventName = (event) ->
    event.toUpperCase().replace ' ', '_'
  
  subscribe = (event, method) ->
    eventName = getEventName event
    if not events[eventName] then events[eventName] = []
    
    token = PubSub.subscribe eventName, method
    tokens[token] = token
    subscribers.push method
    events[eventName].push method
    token
  
  publish = (event, data) ->
    eventName = getEventName event
    if events[eventName]
      PubSub.publish eventName, data
    else
      OJ.console.info 'Event named {' + event + '} is not recognized.'
    return  
  
  unsubscribe = (tokenOrMethod) ->
    if OJ.is.method tokenOrMethod
      if -1 isnt subscribers.indexOf tokenOrMethod
        PubSub.unsubscribe tokenOrMethod
        subscribers = _.remove subscribers, (method) -> method is tokenOrMethod
      else
        OJ.console.info 'Event method is not recognized.'  
    else
      if tokens[tokenOrMethod]
        PubSub.unsubscribe tokenOrMethod
        delete tokens[tokenOrMethod]
    return
  
  unsubscribeAll = () ->
    OJ.each tokens, (token) -> unsubscribe token
    subscribers = []
    events = {}
    return
  
  unsubscribeEvent = (event) ->
    eventName = getEventName event
    if events[eventName]
      OJ.each events[eventName], (method) -> unsubscribe method
    else
      OJ.console.info 'Event named {' + event + '} is not recognized.'
    delete events[eventName]
    return
  
  OJ.register 'publish', publish  
  OJ.register 'subscribe', subscribe  
  OJ.register 'unsubscribe', unsubscribe  
  OJ.register 'unsubscribeAll', unsubscribeAll  
  OJ.register 'unsubscribeEvent', unsubscribeEvent  

  return
) (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
