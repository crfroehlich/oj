# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_listenerIIFE = (OJ) ->
  
  #init the namespace
  OJ.selections.makeSubNameSpace "subscribers"
  
  ###
  Define the subscriber methods which are available to this class.
  ###
  selectionModelSubsribeables = OJ.object()
  selectionModelSubsribeables.select = "select"
  selectionModelSubsribeables.deselect = "deselect"
  OJ.constant OJ.selections, "subscribers", selectionModelSubsribeables
  
  ###
  Create a new subscribers collection. This returns a subscribers object with an add method.
  ###
  OJ.selections.subscribers.register "subscribers", subscribers = ->
    ret = OJ.makeSubscribers("selectionsSubscribers", "selections")
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
