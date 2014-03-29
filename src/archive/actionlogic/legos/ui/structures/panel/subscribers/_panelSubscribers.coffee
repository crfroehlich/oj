# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_listenerIIFE = (OJ) ->
  
  ###
  Define the subscriber methods which are available to this class.
  ###
  panelSubscribers = OJ.object()
  panelSubscribers.afterlayout = "afterlayout"
  OJ.constant OJ.panels, "subscribers", panelSubscribers
  
  ###
  Create a new subscribers collection. This returns a subscribers object with an add method.
  ###
  OJ.panels.subscribers.register "subscribers", panellisteners = ->
    "use strict"
    ret = OJ.makeSubscribers("panelSubscribers", "panels")
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
