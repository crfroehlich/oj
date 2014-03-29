# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_storeIIFE = (OJ) ->
  
  ###
  A Store is a collection of data that is to be rendered in a View or Panel.
  This private class can never be directly instanced.
  @param name {String} A name for the store class
  @param proxy {OJ.stores.proxy} A proxy for loading data into the store
  @param dataModel {OJ.dataModels.dataModel} The dataModel of the store
  ###
  Store = (name, proxy, dataModel) ->
    "use strict"
    that = OJ.classDefinition(
      name: name
      extend: "Ext.data.Store"
      onDefine: (classDef) ->
        OJ.property classDef, "autoSync", true
        OJ.property classDef, "proxy", proxy or OJ.stores.proxy("memory")
        OJ.property classDef, "model", dataModel
        delete classDef.initComponent

        return
    )
    that

  OJ.instanceOf.register "Store", Store
  
  ###
  Instance a new Store for consumption by an Ext view or panel
  @param storeDef.name {String} A name for the store class
  @param storeDef.proxy {OJ.stores.proxy} A proxy for loading data into the store
  @param storeDef.dataModel {OJ.dataModels.dataModel} The dataModel of the store
  @returns {OJ.stores.store} A OJ store
  ###
  OJ.stores.register "store", store = (storeDef) ->
    "use strict"
    throw new Error("Cannot create a Store without options.")  unless storeDef
    storeDef.proxy = OJ.stores.proxy("memory")  unless storeDef.proxy instanceof OJ.instanceOf.Proxy
    throw new Error("Cannot create a Store without a DataModel.")  unless storeDef.dataModel
    ret = new Store(storeDef.name, storeDef.proxy, storeDef.dataModel)
    ret.init()

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
