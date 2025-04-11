import { useState } from 'react';
import './App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="bg-gray-400">
            <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
    );
}

export default App;
