import './App.css';
import { signal } from '@preact/signals';

const count = signal(0);
const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with Preact</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <button
        onClick={() => {
          count.value += 1;
        }}
      >
        count: {count}
      </button>
    </div>
  );
};

export default App;
