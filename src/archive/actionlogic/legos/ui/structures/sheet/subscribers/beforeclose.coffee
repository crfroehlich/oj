# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_beforecloseIIFE = (OJ) ->
  
  ###
  Create a new before close subscriber;
  ###
  OJ.sheets.subscribers.register "beforeclose", subscribers = (callBack) ->
    "use strict"
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-beforeclose
      
      ###
      BeforeClose event on the window.Window
      @param extView {Ext.Component} usually the Ext Window
      @param eOpts {Object} arbitrary Ext props
      ###
      beforeclose = (extView, eOpts) ->
        "use strict"
        
        #callBack.call(extView, extView, eOpts);
        args = arguments_
        OJ.fun.apply callBack, args, this

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
