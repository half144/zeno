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

Zeno provides a simple `useZeno` hook that allows you to share state between React components, even if they're not related in the component hierarchy.

### Basic Example

```jsx
import React from "react";
import { useZeno } from "zeno";

// Example: User authentication state shared across components

// NavBar component shows login status
function NavBar() {
  const [user] = useZeno(null, "currentUser");

  return (
    <nav
      style={{
        padding: "1rem",
        background: "#f8f9fa",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>App Logo</div>
      <div>{user ? `Welcome, ${user.name}` : "Not logged in"}</div>
    </nav>
  );
}

// Login form component that sets the user state
function LoginForm() {
  const [user, setUser] = useZeno(null, "currentUser");

  const handleLogin = () => {
    // Simulate successful login
    setUser({
      id: "123",
      name: "John Doe",
      email: "john@example.com",
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      {!user ? (
        <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
          Login
        </button>
      ) : (
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
          Logout
        </button>
      )}
    </div>
  );
}

// Dashboard component that shows user-specific content
function Dashboard() {
  const [user] = useZeno(null, "currentUser");

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Please log in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <div>
        <p>User ID: {user.id}</p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

// App combines all components
function App() {
  return (
    <div>
      <NavBar />
      <LoginForm />
      <Dashboard />
    </div>
  );
}
```

### Multiple State Example

```jsx
import React from "react";
import { useZeno } from "zeno";

// Multiple states example
function CartCounter() {
  const [cart] = useZeno([], "shoppingCart");
  return <div>Items in cart: {cart.length}</div>;
}

function ProductList() {
  const [cart, setCart] = useZeno([], "shoppingCart");
  const [currency] = useZeno("USD", "currency");

  const products = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const getPrice = (price) => {
    switch (currency) {
      case "EUR":
        return `€${price * 0.85}`;
      case "GBP":
        return `£${price * 0.75}`;
      default:
        return `$${price}`;
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            margin: "1rem 0",
            padding: "1rem",
            border: "1px solid #ddd",
          }}
        >
          <h3>{product.name}</h3>
          <p>Price: {getPrice(product.price)}</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

function CurrencySelector() {
  const [currency, setCurrency] = useZeno("USD", "currency");

  return (
    <div>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        style={{ padding: "0.5rem" }}
      >
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>
  );
}
```

### API

#### `useZeno<T>(initialState, key)`

Hook for managing shared state between components.

**Parameters:**

- `initialState` (T | null): Initial state value. If state already exists with the provided key, this value will be ignored.
- `key` (string): A unique key to identify the shared state.

**Returns:**

An array with two elements:

1. Current state value (T | null)
2. Function to update the state (newState: T) => void

### Why Use Zeno?

- **Simplicity**: Minimalist API based on React hooks
- **Performance**: Only updates components that need to be updated
- **Typed**: Full TypeScript support
- **Zero Config**: No providers or complex setup needed

## License

MIT
