# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_itemdbclickIIFE = (OJ) ->
  
  ###
  Create a new render subscriber;
  ###
  OJ.trees.subscribers.register "itemdblclick", subscribers = (callBack) ->
    "use strict"
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.tree.Panel-event-itemdblclick
      
      ###
      AfterRender event on the tree panel
      @param extView {Ext.Component} usually the Ext Panel
      @param record {Ext.data.Model} The record object
      @param item {HTMLElement} The DOM node
      @param e {Ext.EventObject} The event object
      @param eOpts {Object} arbitrary Ext props
      ###
      itemdblclick = (extView, record, item, index, e, eOpts) ->
        "use strict"
        callBack extView, record, item, index, e, eOpts
        return

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
