import React from "react";
import { useZeno } from "../lib";

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartItem = Product;

// Cart counter component shows number of items in cart
export function CartCounter() {
  const [cart] = useZeno<CartItem[]>([], "shoppingCart");
  return (
    <div style={{ padding: "1rem", background: "#eef", textAlign: "right" }}>
      Items in cart: {cart?.length || 0}
    </div>
  );
}

// Product list that shows products and allows adding to cart
export function ProductList() {
  const [cart, setCart] = useZeno<CartItem[]>([], "shoppingCart");
  const [currency] = useZeno<string>("USD", "currency");

  const products: Product[] = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
  ];

  const addToCart = (product: Product) => {
    setCart(cart ? [...cart, product] : [product]);
  };

  const getPrice = (price: number): string => {
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
    <div style={{ padding: "1rem" }}>
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

// Currency selector allows changing the display currency
export function CurrencySelector() {
  const [currency, setCurrency] = useZeno<string>("USD", "currency");

  return (
    <div style={{ padding: "1rem" }}>
      <label>
        Currency:
        <select
          value={currency || "USD"}
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: "0.5rem", marginLeft: "0.5rem" }}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </label>
    </div>
  );
}

// App combines all components
export function App() {
  return (
    <div>
      <CartCounter />
      <CurrencySelector />
      <ProductList />
    </div>
  );
}
