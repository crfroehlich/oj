((OJ) ->

  ###
   Bind all event handlers
  ###
  bindEvents = (el, events) ->
    if el.node then _.forOwn events, (val, key) ->
      if _.isFunction val and val isnt _.noop  
        callback = (event...) -> val event...
        el.$.bind key, callback
        el.add key, callback
        return
  ###
  Create an HTML Element through ThinDom
  ###
  element = (tag, props, styles, events) ->
    ret = OJ.object()
    ret.add 'node', new ThinDOM tag, props
    ret.add 'tagName', tag
    ret.node.css styles
    ret.add 'css', ret.node.css
    ret.add 'append', ret.node.append
    ret.add 'html', ret.node.html
    ret.add 'text', ret.node.text
    ret.add 'attr', ret.node.attr
    ret.add '$', $(ret.node.get())
    ret.add '0', ret.node.get()
    
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
