/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

/**
* The Tabble Join Store represents the join data bound between columns across tables
*/
(function _joinsStoreIIFE() {
    
    /**
     * Instance a collection of fields to describe a JOIN in the SQL output table
    */
    var SqlDragDropTableJoinModel = OJ.models.model({
        name: 'Ext.OJ.SqlDragDropTableJoinModel',
        fields: [
            ['id'],
            ['leftTableId'],
            ['rightTableId'],
            ['leftTableField'],
            ['rightTableField'],
            ['joinCondition'],
            ['joinType', 'boolean']
        ]
    });

    OJ.actions.querybuilder.lift('SqlDragDropTableJoinModel', SqlDragDropTableJoinModel);

    /**
     * Define the store
    */
    var SqlDragDropTableJoinStore = OJ.stores.store({ name: 'Ext.OJ.SqlDragDropTableJoinStore', model: OJ.actions.querybuilder.SqlDragDropTableJoinModel });

    /**
     * Put the class into the namespace
    */
    OJ.actions.querybuilder.lift('SqlDragDropTableJoinStore', SqlDragDropTableJoinStore);

    

}());