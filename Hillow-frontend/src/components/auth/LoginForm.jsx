import { useState } from "react";

import { loginUser, getCurrentUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Login
      const tokens = await loginUser(formData);

      // Get current user
      const user = await getCurrentUser(tokens.access);

      // Save to AuthContext
      login(user, tokens.access);

      // Close drawer
      onSuccess();
    } catch (err) {
      console.error(err);

      setError("Invalid username or password.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-600">
          {error}
        </div>
      )}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <button
        disabled={loading}
        className="w-full rounded bg-black py-3 text-white"
      >
        {loading ? "Signing In..." : "Login"}
      </button>

    </form>
  );
}