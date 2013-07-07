/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function _treelIIFE(n$) {

    n$.makeSubNameSpace('structureSets');

    /**
     * Define the properties which are available to structureSets.
    */
    var structureSetProperties = n$.object();
    n$.constant(n$.structureSets, 'properties', structureSetProperties);

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
        n$.property(that, 'name', n$.name + '.' + name);
        n$.property(that, 'appFolder', scope);
        n$.property(that, 'autoCreateViewport', true === autoCreateViewport);
        n$.property(that, 'errorHandler', function (err) {
            Cs2.console.error(err);
            throw new Error(err);
        });
        n$.property(that, 'launch', function () {
            Ext.Error.handle = this.errorHandler;
            // copy application to namespace scope so that app can be used as an application singleton
            var setApp = Ext.create('Ext.' + n$.name + '.' + name);
            if (onInit) {
                onInit(that, setApp);
            }

            setApp.show();
            Ext.apply(n$[scope], this);
        });
        
        return Ext.application(that);;
    };

    n$.instanceOf.register('_StructureSet', _StructureSet);

    n$.structureSets.register('_structureSet',
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


}(window.$nameSpace$));
