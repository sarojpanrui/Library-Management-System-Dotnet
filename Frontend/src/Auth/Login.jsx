import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5292/api/Auth/login",
                { email, password },
                { withCredentials: true }
            );

            toast.success("Login Successful");

            const token = response.data.token;
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = payload.role_id;
            
            localStorage.setItem('payload' , JSON.stringify(payload));


            if (role == 0) {
                navigate("/admin");
            } else if (role == 1) {
                navigate("/customer");
            } else {
                toast.error("Unknown role");
            }


        } catch (err) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1470&q=80')",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* Login Form */}
            <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-2xl border border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Login to your library account
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-medium transition duration-200 shadow-md"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Don’t have an account?{" "}
                    <a href="/" className="text-sky-600 hover:underline font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
