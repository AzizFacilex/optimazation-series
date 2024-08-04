const express = require('express');
const { MongoClient } = require('mongodb');
const { createClient } = require('redis');
const util = require('util');
const { promisify } = require('util');
const app = express();
const port = 3000;

// MongoDB setup
const mongoUri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

async function connectToMongoDB() {
    await client.connect();
    db = client.db('testdb');
    console.log("Connected to MongoDB");
}

// Redis setup
const redisClient = createClient();
const redisGet = promisify(redisClient.get).bind(redisClient);

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

async function connectToRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

// Middleware for logging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// API endpoint without caching
app.get('/data', async (req, res) => {
    const collection = db.collection('testcollection');
    const data = await collection.find({}).toArray();
    res.json(data);
});


// API endpoint with caching
app.get('/data-cached', async (req, res) => {
    await connectToRedis();
    const cacheKey = 'dataCache';
    const cachedData = await redisGet(cacheKey);

    if (cachedData) {
        console.log('Cache hit');
        res.json(JSON.parse(cachedData));
    } else {
        console.log('Cache miss');
        const collection = db.collection('testcollection');
        const data = await collection.find({}).toArray();
        await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 });
        res.json(data);
    }
});


// Baseline Query
app.get('/baseline-query', async (req, res) => {
    const collection = db.collection('testcollection');

    console.time('Baseline Query');
    const result = await collection.find({}).toArray();
    console.timeEnd('Baseline Query');

    res.json(result);
});

// Create Index and Query with Index
app.get('/query-with-index', async (req, res) => {
    const collection = db.collection('testcollection');

    await collection.createIndex({ fieldToIndex: 1 });
    console.log("Index created on fieldToIndex");

    console.time('Query with Index');
    const result = await collection.find({ fieldToIndex: 'value1' }).toArray();
    console.timeEnd('Query with Index');

    res.json(result);
});

// Optimized Query
app.get('/optimized-query', async (req, res) => {
    const collection = db.collection('testcollection');

    console.time('Optimized Query');
    const result = await collection.find(
        { fieldToIndex: 'value1' },
        { projection: { fieldToIndex: 1, otherField: 1 } }
    ).toArray();
    console.timeEnd('Optimized Query');

    res.json(result);
});

// Aggregation Query
app.get('/aggregation-query', async (req, res) => {
    const collection = db.collection('testcollection');

    console.time('Aggregation Query');
    const result = await collection.aggregate([
        { $match: { fieldToIndex: 'value1' } },
        { $group: { _id: "$fieldToIndex", total: { $sum: "$amount" } } }
    ]).toArray();
    console.timeEnd('Aggregation Query');

    res.json(result);
});

// Start the server
connectToMongoDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
