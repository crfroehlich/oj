((OJ) ->

  ###
   Bind all event handlers
  ###
  bindEvents = (el, events) ->
    if el then _.forOwn events, (val, key) ->
      if _.isFunction val and val isnt _.noop  
        callback = (event...) -> val event...
        el.$.bind key, callback
        el.add key, callback
        return
  
  ###
  Create an HTML Element through ThinDom
  ###
  element = (tag, props, styles, events) ->
    ret = ThinDOM tag, props
    ret.add 'tagName', tag
    ret.css styles
    ret.add '$', $(ret.get())
    ret.add '0', ret.get()
    
    bindEvents ret, events
    ret
    
  OJ.register 'element', element
  
  ###
  Persist a handle on the body ode
  ###
  if typeof document isnt 'undefined' then body = document.body else body = null  
  thinBody = new ThinDOM null, null, body
  thinBody.getId = ->
    'body'
  
  OJ.register 'body', thinBody 
          
  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
