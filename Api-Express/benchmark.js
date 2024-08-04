const axios = require('axios');

const endpoints = [
    { name: 'Data cached', url: 'http://localhost:3000/data-cached' },
    { name: 'Baseline Query', url: 'http://localhost:3000/baseline-query' },
    { name: 'Query with Index', url: 'http://localhost:3000/query-with-index' },
    { name: 'Optimized Query', url: 'http://localhost:3000/optimized-query' },
    { name: 'Aggregation Query', url: 'http://localhost:3000/aggregation-query' }
];

async function benchmark() {
    for (let endpoint of endpoints) {
        console.log(`Starting ${endpoint.name}`);
        console.time(endpoint.name);

        try {
            const response = await axios.get(endpoint.url);
            // console.log(`Response: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            console.error(`Error with ${endpoint.name}:`, error.message);
        }

        console.timeEnd(endpoint.name);
        console.log('');
    }
}

benchmark();
