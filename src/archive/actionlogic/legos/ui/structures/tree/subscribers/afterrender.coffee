# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_afterrenderIIFE = (OJ) ->
  
  ###
  Create a new render subscriber;
  ###
  OJ.trees.subscribers.register "afterrender", subscribers = (callBack) ->
    "use strict"
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.tree.Panel-event-afterrender
      
      ###
      AfterRender event on the tree panel
      @param extView {Ext.Component} usually the Ext Panel
      @param eOpts {Object} arbitrary Ext props
      ###
      afterrender = (extView, eOpts) ->
        "use strict"
        callBack extView, eOpts
        return

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
