# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_bodyscrollIIFE = (OJ) ->
  
  ###
  Create a new bodyscroll subscriber;
  ###
  OJ.grids.subscribers.register "bodyscroll", subscriber = (callBack) ->
    "use strict"
    if callBack
      
      ###
      Undocumented subscriber method
      ###
      bodyscroll = ->
        args = arguments_
        
        #callBack.call(this, args);
        OJ.fun.apply callBack, args, this

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
