const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected to database");

        const numDocuments = 10000; // Adjust this number as needed for testing
        await insertData(numDocuments);  // Insert data into the collection
        await baselineQuery();           // Run baseline query
        await createIndex();             // Create an index on the collection
        await queryWithIndex();          // Run a query using the index
        await optimizedQuery();          // Run an optimized query
        await aggregationQuery();        // Run an aggregation query
    } catch (err) {
        console.error("Error: ", err);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

async function insertData(numDocuments) {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    // Clear the collection if it already has data
    await collection.deleteMany({});

    const sampleData = [];
    for (let i = 0; i < numDocuments; i++) {
        sampleData.push({
            fieldToIndex: `value${i % 10}`,  // Create 10 unique values for the index field
            amount: Math.floor(Math.random() * 100),  // Random amount between 0 and 99
            otherField: `other${i}`  // Unique value for each document
        });
    }

    await collection.insertMany(sampleData);
    console.log(`${numDocuments} sample data inserted`);
}

async function baselineQuery() {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    console.time('Baseline Query');
    const result = await collection.find({}).toArray();
    console.timeEnd('Baseline Query');

    console.log('Baseline Query Result:', result);
}

async function createIndex() {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    console.time('Create Index');
    await collection.createIndex({ fieldToIndex: 1 });
    console.timeEnd('Create Index');

    console.log("Index created on fieldToIndex");
}

async function queryWithIndex() {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    console.time('Query with Index');
    const result = await collection.find({ fieldToIndex: 'value1' }).toArray();
    console.timeEnd('Query with Index');

    console.log('Query with Index Result:', result);
}

async function optimizedQuery() {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    console.time('Optimized Query');
    const result = await collection.find({ fieldToIndex: 'value1' }, { projection: { fieldToIndex: 1, otherField: 1 } }).toArray();
    console.timeEnd('Optimized Query');

    console.log('Optimized Query Result:', result);
}

async function aggregationQuery() {
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    console.time('Aggregation Query');
    const result = await collection.aggregate([
        { $match: { fieldToIndex: 'value1' } },
        { $group: { _id: "$fieldToIndex", total: { $sum: "$amount" } } }
    ]).toArray();
    console.timeEnd('Aggregation Query');

    console.log('Aggregation Query Result:', result);
}

run().catch(console.dir);
