import { useState } from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

export default function RegisterForm({
  onSuccess,
  switchToLogin,
}) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
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
      // Register user
      await registerUser(formData);

      // Auto login
      const tokens = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      // Get user
      const user = await getCurrentUser(tokens.access);

      // Save in context
      login(user, tokens.access);

      // Close drawer
      onSuccess();

    } catch (err) {
      console.error(err);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Registration failed.");
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <div className="rounded bg-red-100 p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <input
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <input
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
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

      <input
        type="password"
        name="password2"
        placeholder="Confirm Password"
        value={formData.password2}
        onChange={handleChange}
        className="w-full rounded border p-3"
      />

      <button
        disabled={loading}
        className="w-full rounded bg-black py-3 text-white"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="font-semibold underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}