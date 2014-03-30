/*global OJ:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// Test the truthiness of the null Type
(function _nullChecks(OJ) {
    module("indexedDb");
    
    


    var cacheDbMgr = OJ.db.dbManager('ojdb', 1);
    cacheDbMgr.ddl.createTable('CachedData', 'CachedDataId', true);
    cacheDbMgr.ddl.createIndex('CachedData', 'dateTimeId', 'dateTime');
    cacheDbMgr.ddl.createIndex('CachedData', 'userNameId', 'cache.userName');
    cacheDbMgr.ddl.createIndex('CachedData', 'webServiceNameId', 'cache.webServiceName');
    cacheDbMgr.ddl.createIndex('CachedData', 'uniqueCalls', ['cache.webServiceName', 'cache.userName'], true);

    
    /*console.info('Starting data load...');
    console.time('Inserting 100,000 records'); 
    for(var i=0; i < 100000; i += 1) { 
        window.newNuDbReq.insert('debug13', {message: { time: new Date(), text: { fault: Faker.Lorem.words(), subject: Faker.Lorem.sentence(), description: Faker.Lorem.paragraph() }, user: Faker.Helpers.createCard() } }) 
    } 
    console.timeEnd('Inserting 100,000 records');*/
    


    
}((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ));

