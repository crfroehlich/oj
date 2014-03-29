# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_beforeshowIIFE = (OJ) ->
  
  ###
  Create a new render subscriber;
  ###
  OJ.sheets.subscribers.register "beforeshow", (callBack) ->
    "use strict"
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-beforeshow
      
      ###
      BeforeShow event on the window.Window
      @param extView {Ext.Component} usually the Ext Window
      @param eOpts {Object} arbitrary Ext props
      ###
      (extView, eOpts) ->
        "use strict"
        
        #callBack.call(extView, extView, eOpts);
        args = arguments_
        OJ.fun.apply callBack, args, this

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
