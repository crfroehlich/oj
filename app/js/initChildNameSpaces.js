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
    n$.makeSubNameSpace('dataModels');

    /**
     *Grids
    */
    n$.makeSubNameSpace('grids');
    
    /**
     * Grids Columns
    */
    n$.grids.makeSubNameSpace('columns');

    /**
     * Grids Subscribers
    */
    n$.grids.makeSubNameSpace('subscribers');

    /**
     * Stores
    */
    n$.makeSubNameSpace('stores');

    /**
     * Panels
    */
    n$.makeSubNameSpace('panels');

    /**
     * Panel Subscribers
    */
    n$.panels.makeSubNameSpace('subscribers');

    /**
     * Trees
    */
    n$.makeSubNameSpace('trees');

    /**
     * Tree Subscribers
    */
    n$.trees.makeSubNameSpace('subscribers');

    /**
     * Windows.
     * Aside: Since 'window' cannot be used _and_ since few synonyms of the word conjurre the same meaning, use the Russian: sheet (window), sheets (windows)
    */
    n$.makeSubNameSpace('sheets');

    /**
     * Window subscribers
    */
    n$.sheets.makeSubNameSpace('subscribers');


    //#endregion EXT


}(window.$nameSpace$));
