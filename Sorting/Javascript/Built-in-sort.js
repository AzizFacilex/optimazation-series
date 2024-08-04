const array = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000));

console.time('Built-in Sort');
array.sort((a, b) => a - b);
console.timeEnd('Built-in Sort');
