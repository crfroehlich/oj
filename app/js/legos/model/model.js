/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _modelIIFE() {

    /**
     * Define the properties which are available to Model.
    */
    var modelProperties = Object.create(null);
    modelProperties.fields = 'fields';
    OJ.constant(OJ.models, 'properties', modelProperties);

    /**
     * Private class representing the construnction of a model. It returns a OJ.model.model instance with collections for adding columns and listeners.
     * @param name {String} The ClassName of the model to associate with ExtJS
     * @param extend {String} [extend='Ext.model.Model'] An ExtJs class name to extend, usually the Model model
     * @param fields {Array} [fields=new Array()] An array of fields to load with the model
    */
    var Model = function(name, extend, fields) {
        var that = window.OJ.classDefinition({
            name: name,
            extend: extend || 'Ext.data.Model',
            onDefine: function (classDef) {
                classDef.fields = fields;
                delete classDef.initComponent;
            }
        });

        return that;
    };

    OJ.instanceOf.lift('Model', Model);

    /**
     * Create a model object.
     * @param modelDef.name {String} The ClassName of the model to associate with ExtJS
     * @param modelDef.extend {String} [extend='Ext.model.Model'] An ExtJs class name to extend, usually the Model model
     * @param modelDef.fields {Array} [fields=new Array()] An array of fields to load with the model. Fields can be a OJ field or an array (e.g. ['name', 'string', 'Bob'])
     * @returns {OJ.models.model} A model object. Exposese listeners and columns collections. Call init when ready to construct the model. 
    */
    OJ.models.lift('model', function(modelDef) {
        if(!(modelDef)) {
            throw new Error('Cannot instance a model without properties');
        }
        if (!(modelDef.name)) {
            throw new Error('Cannot instance a model without a classname');
        }
        var fields = OJ.fields.fields();
        if (modelDef.fields && modelDef.fields.length > 0) {
            OJ.each(modelDef.fields, function _makeField(field) {
                if (field instanceof OJ.instanceOf.Field) {
                    fields.add(field);
                } else {
                    if (field && field[0]) {
                        var ojField = OJ.fields.field(field[0], field[1], field[2]);
                        fields.add(ojField);
                    }
                }
            });
        }
        var model = new Model(modelDef.name, modelDef.extend, fields.value);
        return model.init();
    });


}());