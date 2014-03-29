# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_dropIIFE = (OJ) ->
  
  ###
  Create a new drop subscriber;
  ###
  OJ.grids.subscribers.register "drop", subscriber = (callBack) ->
    "use strict"
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.grid.plugin.DragDrop-event-drop
      
      ###
      Returns a callback wrapper with the Ext arguments for drop
      @param node {HTMLElement} the Ext node over which the mouse was positioned
      @param data {Object} the associated data object. Has properties: copy, view, ddel, item, records
      @param overModel {Ext.data.Model} the Model where the event fired
      @param dropPosition {String} 'before' or 'after', depending on mouse position
      @param eOpts {Object} arbitrary Ext object
      ###
      drop = (node, data, overModel, dropPosition, eOpts) ->
        "use strict"
        args = arguments_
        OJ.fun.apply callBack, args, this

  return

#callBack.call(this, node, data, overModel, dropPosition, eOpts);
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
