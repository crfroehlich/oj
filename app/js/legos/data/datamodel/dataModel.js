/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _modelIIFE(n$) {


    /**
     * Define the properties which are available to DataModel.
    */
    var dataModelProperties = n$.object();
    dataModelProperties.fields = 'fields';
    n$.constant(n$.dataModels, 'properties', dataModelProperties);

    /**
     * Private class representing the construction of a dataModel. It returns a n$.dataModels.dataModel instance with collections for adding columns and subscribers.
     * @internal
     * @constructor
     * @param name {String} The ClassName of the dataModel to associate with ExtJS
     * @param extend {String} [extend='Ext.model.Model'] An ExtJs class name to extend, usually the Model model
     * @param .dataTypeCollection {n$.dataTypes.collection} [fields=new Array()] An array of fields to load with the dataModel. Fields can be a n$.dataTypes.collection or an array (e.g. ['name', 'string', 'Bob'])
    */
    var DataModel = function (name, extend, dataTypeCollection) {
        var extFieldsCollection = n$.dataTypes.collection();
        
        var that = n$.classDefinition({
            name: name,
            extend: extend || 'Ext.data.Model',
            onDefine: function (classDef) {
                if (dataTypeCollection && dataTypeCollection.length > 0) {
                    n$.each(dataTypeCollection, function _makeCswField(dataType) {
                        if (dataType instanceof n$.instanceOf.DataType) {
                            extFieldsCollection.add(dataType);
                        } else {
                            if (dataType && dataType[0]) {
                                var cswDataType = n$.dataTypes.type(dataType[0], dataType[1], dataType[2]);
                                extFieldsCollection.add(cswDataType);
                            }
                        }
                    });
                }
                classDef.fields = extFieldsCollection.value;
                delete classDef.initComponent;
            }
        });

        return that;
    };

    n$.instanceOf.register('DataModel', DataModel);

    /**
     * Create a dataModel object.
     * @param modelDef.name {String} The ClassName of the dataModel to associate with ExtJS
     * @param modelDef.extend {String} [extend='Ext.model.Model'] An ExtJs class name to extend, usually the Model model
     * @param modelDef.dataTypeCollection {n$.dataTypes.collection} [fields=new Array()] An array of fields to load with the dataModel. Fields can be a n$.dataTypes.collection or an array (e.g. ['name', 'string', 'Bob'])
     * @returns {Csw.dataModels.dataModel} A dataModel object. Exposese subscribers and columns collections. Self-initializes.
    */
    n$.dataModels.register('dataModel', function (modelDef) {
        if (!(modelDef)) {
            throw new Error('Cannot instance a dataModel without properties');
        }
        if (!(modelDef.name)) {
            throw new Error('Cannot instance a dataModel without a classname');
        }
        
        var dataModel = new DataModel(modelDef.name, modelDef.extend, modelDef.dataTypeCollection);
        return dataModel.init();
    });


}(window.$nameSpace$));
