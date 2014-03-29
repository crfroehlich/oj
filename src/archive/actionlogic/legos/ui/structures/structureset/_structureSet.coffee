# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_treelIIFE = (OJ) ->
  OJ.makeSubNameSpace "structureSets"
  
  ###
  Define the properties which are available to structureSets.
  ###
  structureSetProperties = OJ.object()
  OJ.constant OJ.structureSets, "properties", structureSetProperties
  
  ###
  Private class representing the construnction of a structure set.
  @param name {String} The ClassName of the structure set to associate with ExtJS
  @param scope {String} Classname subscope
  @param autoCreateViewport {Boolean} [autoCreateViewport=false]
  @param onInit {Function} [onInit] Optional callback to be applied on construction
  ###
  _StructureSet = (name, scope, autoCreateViewport, onInit) ->
    "use strict"
    that = this
    OJ.property that, "name", OJ.name + "." + name
    OJ.property that, "appFolder", scope
    OJ.property that, "autoCreateViewport", true is autoCreateViewport
    OJ.property that, "errorHandler", (err) ->
      Cs2.console.error err
      throw new Error(err)return

    OJ.property that, "launch", ->
      Ext.Error.handle = @errorHandler
      
      # copy application to namespace scope so that src can be used as an application singleton
      setApp = Ext.create("Ext." + OJ.name + "." + name)
      onInit that, setApp  if onInit
      setApp.show()
      Ext.apply OJ[scope], this
      return

    return Ext.application(that)
    return

  OJ.instanceOf.register "_StructureSet", _StructureSet
  
  ###
  Create a window (sheet) object.
  @param setDef.name {String} The ClassName of the structure set to associate with ExtJS
  @param setDef.scope {String} Classname subscope
  @param setDef.autoCreateViewport {Boolean} [autoCreateViewport=false]
  @param setDef.onInit {Function} [onInit] Optional callback to be applied on construction
  ###
  OJ.structureSets.register "_structureSet", ssetfunc = (setDef) ->
    "use strict"
    throw new Error("Cannot instance a structure set without properties")  unless setDef
    throw new Error("Cannot instance a structure set without a classname")  if not (setDef.name) and not (setDef.id)
    sheet = new _StructureSet(setDef.name, setDef.scope, setDef.autoCreateViewport, setDef.onInit)
    sheet

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
