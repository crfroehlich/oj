# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_modelIIFE = (OJ) ->
  
  ###
  Define the properties which are available to DataModel.
  ###
  dataModelProperties = OJ.object()
  dataModelProperties.fields = "fields"
  OJ.constant OJ.dataModels, "properties", dataModelProperties
  
  ###
  Private class representing the construction of a dataModel. It returns a OJ.dataModels.dataModel instance with collections for adding columns and subscribers.
  @internal
  @constructor
  @param name {String} The ClassName of the dataModel to associate with ExtJS
  @param extend {String} [extend='Ext.model.Model'] An ExtJs class name to extend, usually the Model model
  @param .dataTypeCollection {OJ.dataTypes.collection} [fields=new Array()] An array of fields to load with the dataModel. Fields can be a OJ.dataTypes.collection or an array (e.g. ['name', 'string', 'Bob'])
  ###
  DataModel = (name, extend, dataTypeCollection) ->
    extFieldsCollection = OJ.dataTypes.collection()
    that = OJ.classDefinition(
      name: name
      extend: extend or "Ext.data.Model"
      onDefine: (classDef) ->
        if dataTypeCollection and dataTypeCollection.length > 0
          OJ.each dataTypeCollection, _makeOJField = (dataType) ->
            if dataType instanceof OJ.instanceOf.DataType
              extFieldsCollection.add dataType
            else
              if dataType and dataType[0]
                OJDataType = OJ.dataTypes.type(dataType[0], dataType[1], dataType[2])
                extFieldsCollection.add OJDataType
            return

        classDef.fields = extFieldsCollection.value
        delete classDef.initComponent

        return
    )
    that

  OJ.instanceOf.register "DataModel", DataModel
  
  ###
  Create a dataModel object.
  @param modelDef.name {String} The ClassName of the dataModel to associate with ExtJS
  @param modelDef.extend {String} [extend='Ext.model.Model'] An ExtJs class name to extend, usually the Model model
  @param modelDef.dataTypeCollection {OJ.dataTypes.collection} [fields=new Array()] An array of fields to load with the dataModel. Fields can be a OJ.dataTypes.collection or an array (e.g. ['name', 'string', 'Bob'])
  @returns {OJ.dataModels.dataModel} A dataModel object. Exposese subscribers and columns collections. Self-initializes.
  ###
  OJ.dataModels.register "dataModel", (modelDef) ->
    throw new Error("Cannot instance a dataModel without properties")  unless modelDef
    throw new Error("Cannot instance a dataModel without a classname")  unless modelDef.name
    dataModel = new DataModel(modelDef.name, modelDef.extend, modelDef.dataTypeCollection)
    dataModel.init()

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
