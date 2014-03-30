(function (OJ) {
    module("indexedDb");
    
    


    var cacheDbMgr = OJ.db.dbManager('ojdb1', 2);
    cacheDbMgr.ddl.createTable('CachedData', 'CachedDataId', true);
    cacheDbMgr.ddl.createIndex('CachedData', 'id', 'id');
    cacheDbMgr.ddl.createIndex('CachedData', 'wheels', 'car.wheels');
    cacheDbMgr.ddl.createIndex('CachedData', 'color', 'car.color');
    cacheDbMgr.ddl.createIndex('CachedData', 'unique', ['car.wheels', 'car.color'], true);

    
    console.info('Starting data load...');
    console.time('Inserting 1,000 records'); 
    for(var i=0; i < 5; i += 1) { 
        cacheDbMgr.insert('CachedData', {
             message: {
                 time: new Date(),
                 car: {
                     wheels: Faker.random.number(9999999999),
                     color: Faker.Lorem.sentence(),
                     description: Faker.Lorem.paragraph()
                 },
                 id: Faker.random.number(9999999999)
             }
        })
    } 
    console.timeEnd('Inserting 1,000 records');
    


    
}((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ));

