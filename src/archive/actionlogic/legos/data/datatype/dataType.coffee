# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_dataTypeIIFE = (OJ) ->
  
  ###
  Data Types: the meta data attributes for a value (e.g. the value of a cell in a grid, or the value of a node in a tree, or the value of an input text box)
  ###
  OJ.makeSubNameSpace "dataTypes"
  
  ###
  The private constructor for a DataType object.
  @param defaultValue {String} [defaultValue] A default value
  ###
  DataType = (name, type, defaultValue) ->
    that = this
    OJ.property that, "type", type or "string"
    OJ.property that, "name", name
    OJ.property that, "defaultValue", defaultValue  if defaultValue
    that

  OJ.instanceOf.register "DataType", DataType
  
  ###
  Create a new dataType
  @param namme {String} A unique name for this dataType
  @param type {String} [type='string'] The display type of this dataType
  @param defaultValue {String} [defaultValue] A default value
  ###
  OJ.dataTypes.register "type", (name, type, defaultValue) ->
    throw new Error("Cannot create a dataType without a name")  unless name
    ret = new DataType(name, type, defaultValue)
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
