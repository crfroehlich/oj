# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_listenerIIFE = (OJ) ->
  
  ###
  Define the subscriber methods which are available to this class.
  ###
  gridSubscribeableEvents = OJ.object()
  gridSubscribeableEvents.render = "render"
  gridSubscribeableEvents.drop = "drop"
  gridSubscribeableEvents.bodyscroll = "bodyscroll"
  OJ.constant OJ.grids, "subscribers", gridSubscribeableEvents
  
  ###
  Create a new subscribers collection. This returns a subscribers object with an add method.
  ###
  OJ.grids.subscribers.register "subscribers", subscribers = ->
    ret = OJ.makeSubscribers("gridSubscribers", "grids")
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
