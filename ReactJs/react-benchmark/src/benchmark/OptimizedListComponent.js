// benchmark/OptimizedListComponent.js
import { memo, useCallback } from 'react';

const OptimizedListComponent = memo(({ items }) => {
  // Use useCallback to memoize the processing function
  const processItem = useCallback((item) => {
    let processed = item;
    for (let i = 0; i < 100000; i++) {
        processed = processed.split('').reverse().join(''); // Expensive string operation
    }
    return processed;
}, []);

return (
    <div>
        <h1>Enhanced Optimized List Component</h1>
        <ul>
            {items.map((item, index) => (
                <li key={index}>{processItem(item)}</li>
            ))}
        </ul>
    </div>
);
});

export default OptimizedListComponent;
