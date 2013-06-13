/* jshint undef: true, unused: true */
/* global window:true, Ext:true, $: true */

/**
* The Table Store represents the data bound to a Database Table
*/
(function _joinsStoreIIFE(n$) {


    /**
     * Instance a data type collection to describe a table in the table Tree
    */
    var SqlTableNameModel = n$.models.model({
        name: 'Ext.' + n$.name + '.SqlTableNameModel',
        dataTypeCollection: [
            ['id'],
            ['tableName'],
            ['tableAlias']
        ]
    });

    n$.actions.querybuilder.lift('SqlTableNameModel', SqlTableNameModel);

    /**
     * Define the store
    */
    var SqlTableNameStore = n$.stores.store({ name: 'Ext.' + n$.name + '.SqlTableNameStore', model: n$.actions.querybuilder.SqlTableNameModel });

    /**
     * Put the class into the namespace
    */
    n$.actions.querybuilder.lift('SqlTableNameStore', SqlTableNameStore);


}(window.$nameSpace$));
