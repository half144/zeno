import React from "react";
import { useZeno } from "../lib";

type User = {
  id: string;
  name: string;
  email: string;
};

// NavBar component shows login status
export function NavBar() {
  const [user] = useZeno<User | null>(null, "currentUser");

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
export function LoginForm() {
  const [user, setUser] = useZeno<User | null>(null, "currentUser");

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
export function Dashboard() {
  const [user] = useZeno<User | null>(null, "currentUser");

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
export function App() {
  return (
    <div>
      <NavBar />
      <LoginForm />
      <Dashboard />
    </div>
  );
}
