# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_showIIFE = (OJ) ->
  
  ###
  Create a new show subscriber;
  ###
  OJ.sheets.subscribers.register "show", subscribers = (callBack) ->
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.window.Window-event-show
      
      ###
      Show event on the tree panel
      @param extView {Ext.Component} usually the Ext Window
      @param eOpts {Object} arbitrary Ext props
      ###
      show = (extView, eOpts) ->
        
        #callBack.call(extView, extView, eOpts);
        args = arguments_
        OJ.fun.apply callBack, args, this

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
