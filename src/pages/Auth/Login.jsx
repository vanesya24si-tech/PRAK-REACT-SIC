import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signIn(dataForm.email, dataForm.password);

      navigate("/");

    } catch (err) {
      setError(
        err.message || "Email atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Welcome Back 👋
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Loading Message */}
      {loading && (
        <div className="mb-4 bg-green-100 text-green-600 px-4 py-3 rounded-lg text-sm animate-pulse">
          Processing login...
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={dataForm.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={dataForm.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
            placeholder="********"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Belum punya akun?{" "}
        <Link to="/register" className="text-green-500 hover:underline">
          Register
        </Link>
      </p>

    </div>
  );
}