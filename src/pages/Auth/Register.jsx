import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [dataForm, setDataForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Member",
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

        if (dataForm.password !== dataForm.confirmPassword) {
            setError("Password tidak cocok");
            setLoading(false);
            return;
        }

        try {
            await signUp(dataForm.email, dataForm.password, dataForm.name, dataForm.role);

            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");

        } catch (err) {
            setError(
                err.message || "Gagal melakukan registrasi"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Create Your Account ✨
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
                    Processing registration...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-5">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={dataForm.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="Your full name"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={dataForm.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={dataForm.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="********"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={dataForm.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            placeholder-gray-400"
                        placeholder="********"
                        required
                    />
                </div>

                {/* Role Selector */}
                <div className="mb-6">
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Register As
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={dataForm.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                        required
                    >
                        <option value="Member">Customer (Member)</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4
                        rounded-lg transition duration-300"
                >
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-green-500 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    )
}