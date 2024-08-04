const { performance } = require('perf_hooks');

// Number of asynchronous operations
const numOps = 1000;

// Callbacks
function asyncCallback(callback) {
    setTimeout(callback, 1);
}

function benchmarkCallbacks() {
    return new Promise(resolve => {
        let count = 0;
        function next() {
            if (count < numOps) {
                asyncCallback(next);
                count++;
            } else {
                resolve();
            }
        }
        next();
    });
}

// Promises
function asyncPromise() {
    return new Promise(resolve => setTimeout(resolve, 1));
}

function benchmarkPromises() {
    return new Promise(resolve => {
        let count = 0;
        function next() {
            if (count < numOps) {
                asyncPromise().then(next);
                count++;
            } else {
                resolve();
            }
        }
        next();
    });
}

// async/await
async function asyncAwait() {
    for (let i = 0; i < numOps; i++) {
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}

// Benchmark function
async function benchmark(title, fn) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    console.log(`${title}: ${end - start}ms`);
}

// Run benchmarks
benchmark('Callback Pattern', benchmarkCallbacks);
benchmark('Promise Pattern', benchmarkPromises);
benchmark('Async/Await Pattern', asyncAwait);
