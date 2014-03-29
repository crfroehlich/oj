# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_listenerIIFE = (OJ) ->
  
  ###
  Define the subscriber methods which are available to this class.
  ###
  sheetSubscribers = OJ.object()
  sheetSubscribers.add "beforeclose", "beforeclose"
  sheetSubscribers.add "beforeshow", "beforeshow"
  sheetSubscribers.add "show", "show"
  OJ.constant OJ.sheets, "subscribers", sheetSubscribers
  
  ###
  Create a new subscribers collection. This returns a subscribers object with an add method.
  ###
  OJ.sheets.subscribers.register "subscribers", subscribers = ->
    "use strict"
    ret = OJ.makeSubscribers("sheetSubscribers", "sheets")
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
