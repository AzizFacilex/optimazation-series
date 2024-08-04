const { performance } = require('perf_hooks');

const arraySize = 1000000;
const testArray = Array.from({ length: arraySize }, (_, i) => i);

function benchmark(title, fn) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${title}: ${end - start}ms`);
}

function forLoop() {
    let sum = 0;
    for (let i = 0; i < testArray.length; i++) {
        sum += testArray[i];
    }
    return sum;
}

function forOfLoop() {
    let sum = 0;
    for (const value of testArray) {
        sum += value;
    }
    return sum;
}

function forEachLoop() {
    let sum = 0;
    testArray.forEach(value => {
        sum += value;
    });
    return sum;
}

function mapLoop() {
    let sum = 0;
    testArray.map(value => {
        sum += value;
    });
    return sum;
}

function reduceLoop() {
    return testArray.reduce((sum, value) => sum + value, 0);
}

function whileLoop() {
    let sum = 0;
    let i = 0;
    while (i < testArray.length) {
        sum += testArray[i];
        i++;
    }
    return sum;
}

// Benchmark each method
benchmark('For Loop', forLoop);
benchmark('For...of Loop', forOfLoop);
benchmark('forEach Method', forEachLoop);
benchmark('Map Method', mapLoop);
benchmark('Reduce Method', reduceLoop);
benchmark('While Loop', whileLoop);
