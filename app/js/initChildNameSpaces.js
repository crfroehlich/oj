/* jshint undef: true, unused: true */
/* global Csw2:true, window:true, Ext:true, $: true */

(function(n$) {

    //#region CORE 

    /**
     * Custom Errors
    */
    n$.makeSubNameSpace('errors');

    /**
     * Type checking
    */
    n$.makeSubNameSpace('is');

    /**
     * To instance check classes
    */
    n$.makeSubNameSpace('instanceOf');

    /**
     * Type conversion
    */
    n$.makeSubNameSpace('to');

    //#endregion CORE 

    //#region ACTIONS 

    /**
     * Actions
    */
    n$.makeSubNameSpace('actions');

    /**
     * Query Builder
    */
    n$.actions.makeSubNameSpace('querybuilder');

    /**
     * SQL
    */
    n$.actions.makeSubNameSpace('sql');

    //#endregion ACTIONS 

    //#region DOM 

    /**
     * The MetaData namespace. Represents the structures of nameSpaceName nodes, elements and properties.
     */
    n$.makeSubNameSpace('metadata');

    /**
     * The node namespace. Represents an nameSpaceName Node and its properties.
     * [1]: This class is responsible for constructing the DOM getters (properties on this object which reference Nodes in the DOM tree)
     * [2]: This class exposes helper methods which can get/set properties on this instance of the node.
     * [3]: This class validates the execution of these methods (e.g. Is the node still in the DOM; has it been GC'd behind our backs)
     * [4]: Maintaining an im-memory representation of tree with children/parents
     */
    n$.makeSubNameSpace('node');

    //#endregion DOM

    //#region EXT

    

    /**
     * Models
    */
    n$.makeSubNameSpace('models');

    /**
     *Grids
    */
    n$.makeSubNameSpace('grids');
    
    /**
     * Grids Columns
    */
    n$.grids.makeSubNameSpace('columns');

    /**
     * Grids Listeners
    */
    n$.grids.makeSubNameSpace('listeners');

    /**
     * Stores
    */
    n$.makeSubNameSpace('stores');

    /**
     * Panels
    */
    n$.makeSubNameSpace('panels');

    /**
     * Panel Listeners
    */
    n$.panels.makeSubNameSpace('listeners');

    /**
     * Trees
    */
    n$.makeSubNameSpace('trees');

    /**
     * Tree Listeners
    */
    n$.trees.makeSubNameSpace('listeners');

    /**
     * Windows.
     * Aside: Since 'window' cannot be used _and_ since few synonyms of the word conjurre the same meaning, use the Russian: okno (window), okna (windows)
    */
    n$.makeSubNameSpace('okna');

    /**
     * Window listeners
    */
    n$.okna.makeSubNameSpace('listeners');


    //#endregion EXT


}(window.$nameSpace$));
