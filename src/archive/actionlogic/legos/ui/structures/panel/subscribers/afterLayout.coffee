# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_afterrenderIIFE = (OJ) ->
  
  ###
  Create a new afterlayout subscriber;
  ###
  OJ.panels.subscribers.register "afterlayout", subscribers = (callBack) ->
    "use strict"
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.panel.Panel-event-afterlayout
      
      ###
      Returns a callback wrapper with the Ext arguments for afterlayout
      @param viewEl {Ext.Component} Usually the Panel object
      @param layout {Ext.layout.container.Container} The container object
      @param eOpts {Object} arbitrary Ext object
      ###
      afterlayout = (viewEl, layout, eOpts) ->
        "use strict"
        callBack viewEl, layout, eOpts
        return

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
