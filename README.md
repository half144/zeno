# Zeno

A simple and efficient library for shared state management between React components.

## Installation

```bash
npm install zeno
```

or

```bash
yarn add zeno
```

## Usage

Zeno provides a `useZeno` hook that allows you to share state between React components, regardless of their position in the hierarchy.

### Basic Example

```jsx
import React from "react";
import { useZeno } from "zeno";

// Component that displays the counter
function CounterDisplay() {
  const [counter] = useZeno(0, "counter");

  return (
    <div>
      <h2>Current value: {counter}</h2>
    </div>
  );
}

// Component with buttons to control the counter
function CounterControls() {
  const [counter, setCounter] = useZeno(0, "counter");

  return (
    <div>
      <button onClick={() => setCounter(counter - 1)}>-</button>
      <button onClick={() => setCounter(counter + 1)}>+</button>
    </div>
  );
}

// App using both components
function App() {
  return (
    <div>
      <CounterDisplay />
      <CounterControls />
    </div>
  );
}
```

### API

#### `useZeno<T>(initialState, key)`

Hook for managing shared state between components.

**Parameters:**

- `initialState` (T): Initial state value
- `key` (string): Unique identifier for the shared state

**Returns:**

- Array with [currentValue, updaterFunction]

### Why Use Zeno?

- 🎯 Minimalist hook-based API
- ⚡ Updates only necessary components
- 📦 Zero configuration
- 🔒 Full TypeScript support

## License

MIT
