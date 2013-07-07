/*global nameSpace:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// Test the truthiness of the null Type
(function _nullChecks(n$) {
	module("indexedDb");
	
    var tableName = 'debug', dbName = 'diagnostics14', dbVersion = 1;
    window.newNuDbReq = n$.db.dbManager();
    window.newNuDbReq.connect(dbName, dbVersion);
    
    //newNuDbReq.ddl.dropTable(tableName);
    window.newNuDbReq.ddl.createTable(tableName, 'messageid', true);
    
    window.newNuDbReq.ddl.createIndex(tableName, 'subjectid', 'text.subject');
    window.newNuDbReq.ddl.createIndex(tableName, 'timeid', 'time');
    window.newNuDbReq.ddl.createIndex(tableName, 'usernameid', 'user.name');
    
    /*console.info('Starting data load...');
    console.time('Inserting 100,000 records'); 
    for(var i=0; i < 100000; i += 1) { 
        window.newNuDbReq.insert('debug13', {message: { time: new Date(), text: { fault: Faker.Lorem.words(), subject: Faker.Lorem.sentence(), description: Faker.Lorem.paragraph() }, user: Faker.Helpers.createCard() } }) 
    } 
    console.timeEnd('Inserting 100,000 records');*/
    


	//#endregion nameSpace.is.number

}(window.$nameSpace$));

