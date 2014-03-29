# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_treelIIFE = (OJ) ->
  
  ###
  Create a window (sheet) object.
  @param setDef.name {String} The ClassName of the structure set to associate with ExtJS
  @param setDef.scope {String} Classname subscope
  @param setDef.autoCreateViewport {Boolean} [autoCreateViewport=false]
  @param setDef.onInit {Function} [onInit] Optional callback to be applied on construction
  ###
  OJ.structureSets.register "structureSet", ssetfunc = (setDef) ->
    "use strict"
    OJ.structureSets._structureSet setDef

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
