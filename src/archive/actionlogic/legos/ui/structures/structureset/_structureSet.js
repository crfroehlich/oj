/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function _treelIIFE(OJ) {

    OJ.makeSubNameSpace('structureSets');

    /**
     * Define the properties which are available to structureSets.
    */
    var structureSetProperties = OJ.object();
    OJ.constant(OJ.structureSets, 'properties', structureSetProperties);

    /**
     * Private class representing the construnction of a structure set. 
     * @param name {String} The ClassName of the structure set to associate with ExtJS
     * @param scope {String} Classname subscope
     * @param autoCreateViewport {Boolean} [autoCreateViewport=false] 
     * @param onInit {Function} [onInit] Optional callback to be applied on construction
    */
    var _StructureSet = function (name, scope, autoCreateViewport, onInit) {
        'use strict';

        var that = this;
        OJ.property(that, 'name', OJ.name + '.' + name);
        OJ.property(that, 'appFolder', scope);
        OJ.property(that, 'autoCreateViewport', true === autoCreateViewport);
        OJ.property(that, 'errorHandler', function (err) {
            Cs2.console.error(err);
            throw new Error(err);
        });
        OJ.property(that, 'launch', function () {
            Ext.Error.handle = this.errorHandler;
            // copy application to namespace scope so that src can be used as an application singleton
            var setApp = Ext.create('Ext.' + OJ.name + '.' + name);
            if (onInit) {
                onInit(that, setApp);
            }

            setApp.show();
            Ext.apply(OJ[scope], this);
        });
        
        return Ext.application(that);;
    };

    OJ.instanceOf.register('_StructureSet', _StructureSet);

    OJ.structureSets.register('_structureSet',
        /**
         * Create a window (sheet) object.
         * @param setDef.name {String} The ClassName of the structure set to associate with ExtJS
        * @param setDef.scope {String} Classname subscope
        * @param setDef.autoCreateViewport {Boolean} [autoCreateViewport=false] 
        * @param setDef.onInit {Function} [onInit] Optional callback to be applied on construction 
        */
        function ssetfunc(setDef) {
            'use strict';
            if (!(setDef)) {
                throw new Error('Cannot instance a structure set without properties');
            }
            if (!(setDef.name) && !(setDef.id)) {
                throw new Error('Cannot instance a structure set without a classname');
            }
            var sheet = new _StructureSet(setDef.name, setDef.scope, setDef.autoCreateViewport, setDef.onInit);
            return sheet;
        });


}((typeof global !== "undefined" && global ? global : (typeof window !== "undefined" ? window : this)).OJ));
