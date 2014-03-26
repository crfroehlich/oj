/* jshint undef: true, unused: true */
/* global n$:true, window:true, Ext:true, $: true */

(function(n$) {

    var OJ = n$;

    //#region CORE 

    /**
     * Custom Errors
    */
    OJ.makeSubNameSpace('errors');

    /**
     * Type checking
    */
    OJ.makeSubNameSpace('is');

    /**
     * To instance check classes
    */
    OJ.makeSubNameSpace('instanceOf');

    /**
     * Type conversion
    */
    OJ.makeSubNameSpace('to');

    //#endregion CORE 

    //#region ACTIONS 

    /**
     * Actions
    */
    OJ.makeSubNameSpace('actions');

    /**
     * Query Builder
    */
    OJ.actions.makeSubNameSpace('querybuilder');

    /**
     * SQL
    */
    OJ.actions.makeSubNameSpace('sql');

    //#endregion ACTIONS 

    //#region DOM 

    /**
     * The MetaData namespace. Represents the structures of nameSpaceName nodes, elements and properties.
     */
    OJ.makeSubNameSpace('metadata');

    /**
     * The node namespace. Represents an nameSpaceName Node and its properties.
     * [1]: This class is responsible for constructing the DOM getters (properties on this object which reference Nodes in the DOM tree)
     * [2]: This class exposes helper methods which can get/set properties on this instance of the node.
     * [3]: This class validates the execution of these methods (e.g. Is the node still in the DOM; has it been GC'd behind our backs)
     * [4]: Maintaining an im-memory representation of tree with children/parents
     */
    OJ.makeSubNameSpace('node');

    //#endregion DOM

    //#region EXT

    

    /**
     * Models
    */
    OJ.makeSubNameSpace('dataModels');

    /**
     *Grids
    */
    OJ.makeSubNameSpace('grids');
    
    /**
     * Grids Columns
    */
    OJ.grids.makeSubNameSpace('columns');

    /**
     * Grids Subscribers
    */
    OJ.grids.makeSubNameSpace('subscribers');

    /**
     * Stores
    */
    OJ.makeSubNameSpace('stores');

    /**
     * Panels
    */
    OJ.makeSubNameSpace('panels');

    /**
     * Panel Subscribers
    */
    OJ.panels.makeSubNameSpace('subscribers');

    /**
     * Trees
    */
    OJ.makeSubNameSpace('trees');

    /**
     * Tree Subscribers
    */
    OJ.trees.makeSubNameSpace('subscribers');

    /**
     * Windows.
     * Aside: Since 'window' cannot be used _and_ since few synonyms of the word conjurre the same meaning, use the Russian: sheet (window), sheets (windows)
    */
    OJ.makeSubNameSpace('sheets');

    /**
     * Window subscribers
    */
    OJ.sheets.makeSubNameSpace('subscribers');


    //#endregion EXT


}(window.$nameSpace$));
