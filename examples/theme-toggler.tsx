import React from "react";
import { useZeno } from "../lib";

// Header component uses the shared theme
export function Header() {
  const [theme] = useZeno("light", "theme");

  return (
    <header
      style={{
        background: theme === "dark" ? "#333" : "#f0f0f0",
        color: theme === "dark" ? "white" : "black",
        padding: "1rem",
      }}
    >
      <h1>Zeno Demo</h1>
    </header>
  );
}

// Theme toggle button component that changes the shared state
export function ThemeToggle() {
  const [theme, setTheme] = useZeno("light", "theme");

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      style={{
        background: theme === "dark" ? "#f0f0f0" : "#333",
        color: theme === "dark" ? "black" : "white",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}

// Content component that also uses the shared theme
export function Content() {
  const [theme] = useZeno("light", "theme");

  return (
    <main
      style={{
        background: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#eee" : "#222",
        padding: "2rem",
        transition: "all 0.3s ease",
      }}
    >
      <p>This content changes with the theme.</p>
      <ThemeToggle />
    </main>
  );
}

// App combines all components
export function App() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}
