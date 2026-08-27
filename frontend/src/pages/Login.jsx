import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../features/authSlice.js";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            dispatch(loginFailure("Email and password are required."));
            return;
        }

        try {
            dispatch(loginStart());

            /*
             * Replace this URL with your actual backend login endpoint.
             */
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);
            console.log("TOKEN FROM BACKEND:", data.token);

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            /*
             * Expected backend response:
             *
             * {
             *   user: {...},
             *   token: "your-jwt-token"
             * }
             */

            dispatch(
                loginSuccess({
                    user: data.user,
                    token: data.token,
                })
            );

            // Optional: save token for page refreshes
            // localStorage.setItem(
            //     "token",
            //     data.token
            // );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Optional redirect
            navigate("/dashboard");
        } catch (error) {
            dispatch(
                loginFailure(
                    error.message || "Something went wrong."
                )
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo / Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Restaurant Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to manage your restaurant
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <h2 className="text-xl font-semibold text-slate-900">
                        Welcome back
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Enter your credentials to continue.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Restaurant Management Dashboard
                </p>
            </div>
        </div>
    );
};

export default Login;