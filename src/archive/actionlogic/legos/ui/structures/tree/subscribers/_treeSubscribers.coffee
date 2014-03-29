# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_listenerIIFE = (OJ) ->
  
  ###
  Define the subscriber methods which are available to this class.
  ###
  treeSubscribers = Object.create(null)
  treeSubscribers.afterrender = "afterrender"
  treeSubscribers.itemdblclick = "itemdblclick"
  OJ.constant OJ.trees, "subscribers", treeSubscribers
  
  ###
  Create a new subscribers collection. This returns a subscribers object with an add method.
  ###
  OJ.trees.subscribers.register "subscribers", subscribers = ->
    "use strict"
    ret = OJ.makeSubscribers("treeSubscribers", "trees")
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
