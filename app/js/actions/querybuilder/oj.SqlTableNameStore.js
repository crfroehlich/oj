/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

/**
* The Table Store represents the data bound to a Database Table
*/
(function _joinsStoreIIFE() {

    
    /**
     * Instance a collection of fields to describe a table in the table Tree
    */
    var SqlTableNameModel = OJ.models.model({
        name: 'Ext.OJ.SqlTableNameModel',
        fields: [
            ['id'],
            ['tableName'],
            ['tableAlias']
        ]
    });

    OJ.actions.querybuilder.lift('SqlTableNameModel', SqlTableNameModel);

    /**
     * Define the store
    */
    var SqlTableNameStore = OJ.stores.store({ name: 'Ext.OJ.SqlTableNameStore', model: OJ.actions.querybuilder.SqlTableNameModel });
    
    /**
     * Put the class into the namespace
    */
    OJ.actions.querybuilder.lift('SqlTableNameStore', SqlTableNameStore);
    

}());