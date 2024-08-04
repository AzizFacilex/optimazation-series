function ComplexListComponent({ items }) {
       // Simulate complex rendering logic with heavy computations
       const processItem = (item) => {
        let processed = item;
        for (let i = 0; i < 100000; i++) {
            processed = processed.split('').reverse().join(''); // Expensive string operation
        }
        return processed;
    };

    return (
        <div>
            <h1>Enhanced Complex List Component</h1>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{processItem(item)}</li>
                ))}
            </ul>
        </div>
    );
}

export default ComplexListComponent;
