# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_renderIIFE = (OJ) ->
  
  ###
  Create a new render subscriber;
  ###
  OJ.grids.subscribers.register "render", subscribers = (callBack) ->
    if callBack
      
      #http://docs.sencha.com/extjs/4.1.3/#!/api/Ext.grid.Panel-event-render
      
      ###
      Render event on the grid panel
      @param extView {Ext.Component} usually the Ext Panel
      @param eOpts {Object} arbitrary Ext props
      ###
      render = (extView, eOpts) ->
        args = arguments_
        OJ.fun.apply callBack, args, this

  return

#callBack.call(this, extView, eOpts);
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
