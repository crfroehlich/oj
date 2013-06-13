/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function() {

    //#region CORE 

    /**
     * Custom Errors
    */
    window.OJ.makeSubNameSpace('errors');

    /**
     * Type checking
    */
    window.OJ.makeSubNameSpace('is');

    /**
     * To instance check classes
    */
    window.OJ.makeSubNameSpace('instanceOf');

    /**
     * Type conversion
    */
    window.OJ.makeSubNameSpace('to');

    //#endregion CORE 

    //#region ACTIONS 

    /**
     * Actions
    */
    window.OJ.makeSubNameSpace('actions');

    /**
     * Query Builder
    */
    window.OJ.actions.makeSubNameSpace('querybuilder');

    /**
     * SQL
    */
    window.OJ.actions.makeSubNameSpace('sql');

    //#endregion ACTIONS 

    //#region DOM 

    /**
     * The MetaData namespace. Represents the structures of nameSpaceName nodes, elements and properties.
     */
    window.OJ.makeSubNameSpace('metadata');

    /**
     * The node namespace. Represents an nameSpaceName Node and its properties.
     * [1]: This class is responsible for constructing the DOM getters (properties on this object which reference Nodes in the DOM tree)
     * [2]: This class exposes helper methods which can get/set properties on this instance of the node.
     * [3]: This class validates the execution of these methods (e.g. Is the node still in the DOM; has it been GC'd behind our backs)
     * [4]: Maintaining an im-memory representation of tree with children/parents
     */
    window.OJ.makeSubNameSpace('node');

    //#endregion DOM

    //#region EXT

    /**
     * Fields
    */
    window.OJ.makeSubNameSpace('fields');

    /**
     * Models
    */
    window.OJ.makeSubNameSpace('models');

    /**
     *Grids
    */
    window.OJ.makeSubNameSpace('grids');
    
    /**
     * Grids Columns
    */
    window.OJ.grids.makeSubNameSpace('columns');

    /**
     * Grids Listeners
    */
    window.OJ.grids.makeSubNameSpace('listeners');

    /**
     * Stores
    */
    window.OJ.makeSubNameSpace('stores');

    /**
     * Panels
    */
    window.OJ.makeSubNameSpace('panels');

    /**
     * Panel Listeners
    */
    window.OJ.panels.makeSubNameSpace('listeners');

    /**
     * Trees
    */
    window.OJ.makeSubNameSpace('trees');

    /**
     * Tree Listeners
    */
    window.OJ.trees.makeSubNameSpace('listeners');

    /**
     * Windows.
     * Aside: Since 'window' cannot be used _and_ since few synonyms of the word conjurre the same meaning, use the Russian: okno (window), okna (windows)
    */
    window.OJ.makeSubNameSpace('okna');

    /**
     * Window listeners
    */
    window.OJ.okna.makeSubNameSpace('listeners');


    //#endregion EXT


}());