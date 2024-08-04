import { useState, useEffect } from 'react';
import ComplexListComponent from './benchmark/ComplexListComponent';
import OptimizedListComponent from './benchmark/OptimizedListComponent';

const generateItems = (count) => Array.from({ length: count }, (_, i) => `Item ${i}`);

function App() {
    const [showComplex, setShowComplex] = useState(false);
    const [showOptimized, setShowOptimized] = useState(false);
    const items = generateItems(1000); // Large list of items for benchmarking

    useEffect(() => {
        const benchmark = async () => {
            // Measure rendering for ComplexListComponent
            let start = performance.now();
            for (let i = 0; i < 10; i++) {
                setShowComplex(true);
                await new Promise(requestAnimationFrame);
                setShowComplex(false);
                await new Promise(requestAnimationFrame);
            }
            let end = performance.now();
            console.log(`ComplexListComponent average render time: ${(end - start) / 10}ms`);

            // Measure rendering for OptimizedListComponent
            start = performance.now();
            for (let i = 0; i < 10; i++) {
                setShowOptimized(true);
                await new Promise(requestAnimationFrame);
                setShowOptimized(false);
                await new Promise(requestAnimationFrame);
            }
            end = performance.now();
            console.log(`OptimizedListComponent average render time: ${(end - start) / 10}ms`);
        };

        benchmark();
    }, []);

    return (
        <div className="App">
            {showComplex && <ComplexListComponent items={items} />}
            {showOptimized && <OptimizedListComponent items={items} />}
        </div>
    );
}

export default App;
