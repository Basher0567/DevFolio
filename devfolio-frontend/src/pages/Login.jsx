
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isOwnerLoggedIn, loginOwner } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isOwnerLoggedIn()) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginOwner(form.username, form.password);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Login failed. Check your credentials and Owner permissions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-section">
      <div className="login-card card">
        <p className="eyebrow">OWNER ACCESS</p>
        <h1>Welcome back</h1>
        <p>Sign in to manage your portfolio.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              autoComplete="username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {error && <p role="alert" className="error-message">{error}</p>}

          <button className="button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
