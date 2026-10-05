import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

type LoginResponse = {
    user: {
        id: number;
        name: string;
        email: string;
        role: "manager" | "staff";
    };
    permissions: string[];
    organization: {
        id: number;
        name: string;
    };
    token: string;
};

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data: LoginResponse & { message?: string } =
                await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid login details.");
            }

            sessionStorage.setItem("auth_token", data.token);
            sessionStorage.setItem("auth_user", JSON.stringify(data.user));
            sessionStorage.setItem(
                "auth_permissions",
                JSON.stringify(data.permissions),
            );
            sessionStorage.setItem(
                "auth_organization",
                JSON.stringify(data.organization),
            );

            navigate("/dashboard", {
                replace: true,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setError("");
        setGoogleLoading(true);
        window.location.href = "/api/auth/google";
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="login-orb login-orb-one" />
                <div className="login-orb login-orb-two" />
                <div className="login-orb login-orb-three" />
            </div>

            <div className="login-container">
                <div className="login-brand">
                    <div className="brand-icon">
                        <span>IM</span>
                    </div>

                    <div>
                        <h1>Inventory</h1>
                        <p>Management System</p>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <h2>Welcome back</h2>

                        <p>Sign in to access your inventory dashboard</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>

                            <div className="input-wrapper">
                                <span className="input-icon">@</span>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="password-label">
                                <label htmlFor="password">Password</label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="input-wrapper">
                                <span className="input-icon">•</span>

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword((value) => !value)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading || googleLoading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>or continue with email</span>
                    </div>
                    <button
                        type="button"
                        className="google-button"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading || loading}
                    >
                        <span className="google-icon">G</span>

                        <span>
                            {googleLoading
                                ? "Connecting..."
                                : "Continue with Google"}
                        </span>
                    </button>

                    <div className="login-footer">
                        <span>Don't have an organization?</span>

                        <button
                            type="button"
                            onClick={() => navigate("/create-organization")}
                        >
                            Create one
                        </button>
                    </div>
                </div>

                <p className="login-security">
                    Secure access for managers and authorized staff
                </p>
            </div>
        </div>
    );
};

export default Login;
