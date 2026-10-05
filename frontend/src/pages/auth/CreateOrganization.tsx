import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateOrganization.css";

type Step = 1 | 2;

type OrganizationResponse = {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: "manager";
    };
    permissions: string[];
    organization: {
        id: number;
        name: string;
    };
    message?: string;
};

const CreateOrganization = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>(1);
    const [direction, setDirection] = useState<"forward" | "backward">(
        "forward",
    );

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [organizationName, setOrganizationName] = useState("");
    const [organizationType, setOrganizationType] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const goToStepTwo = () => {
        setError("");

        if (!fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter a password.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setDirection("forward");
        setStep(2);
    };

    const handleGoogleSignup = async () => {
        setError("");
        setGoogleLoading(true);

        setTimeout(() => {
            setGoogleLoading(false);
            setDirection("forward");
            setStep(2);
        }, 700);
    };

    const goBackToStepOne = () => {
        setError("");
        setDirection("backward");
        setStep(1);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!organizationName.trim()) {
            setError("Please enter your organization name.");
            return;
        }

        if (!organizationType) {
            setError("Please select your organization type.");
            return;
        }

        if (!country.trim()) {
            setError("Please enter your country.");
            return;
        }

        if (!city.trim()) {
            setError("Please enter your city.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/organizations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: {
                        name: fullName.trim(),
                        email: email.trim(),
                        password,
                        password_confirmation: confirmPassword,
                    },
                    organization: {
                        name: organizationName.trim(),
                        type: organizationType,
                        country: country.trim(),
                        city: city.trim(),
                        phone: phone.trim(),
                        address: address.trim(),
                        description: description.trim(),
                    },
                }),
            });

            const data: OrganizationResponse & { message?: string } =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create your organization.",
                );
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

    return (
        <div className="organization-page">
            <div className="organization-background">
                <div className="organization-orb organization-orb-one" />
                <div className="organization-orb organization-orb-two" />
                <div className="organization-orb organization-orb-three" />
            </div>

            <main className="organization-container">
                <div className="organization-topbar">
                    <button
                        type="button"
                        className="organization-brand"
                        onClick={() => navigate("/")}
                    >
                        <div className="organization-brand-icon">
                            <span>IM</span>
                        </div>

                        <div className="organization-brand-copy">
                            <h1>Inventory</h1>
                            <p>Management System</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        className="organization-login"
                        onClick={() => navigate("/auth")}
                    >
                        Already have an account?
                        <strong>Sign in</strong>
                    </button>
                </div>

                <div className="organization-content">
                    <div className="organization-heading">
                        <h2>
                            {step === 1
                                ? "Create your account"
                                : "Set up your organization"}
                        </h2>

                        <p>
                            {step === 1
                                ? "Start by creating your account. You can use your Google account or continue with your email."
                                : "Tell us a little about your organization so we can prepare your inventory workspace."}
                        </p>
                        <br />

                        {/* <div className="organization-progress">
                            <div className="progress-item active">
                                <span>1</span>
                                <div>
                                    <strong>Account</strong>
                                    <small>Your details</small>
                                </div>
                            </div>

                            <div
                                className={`progress-connector ${
                                    step === 2 ? "completed" : ""
                                }`}
                            />

                            <div
                                className={`progress-item ${
                                    step === 2 ? "active" : ""
                                }`}
                            >
                                <span>2</span>
                                <div>
                                    <strong>Organization</strong>
                                    <small>Business details</small>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    {error && (
                        <div className="organization-error">
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div
                        className={`organization-slider ${
                            direction === "forward"
                                ? "slide-forward"
                                : "slide-backward"
                        }`}
                        key={step}
                    >
                        {step === 1 ? (
                            <section className="organization-step">
                                <div className="step-card">
                                    <div className="step-card-header">
                                        <div>
                                            <div className="organization-step-label">
                                                <span className="step-number">
                                                    01
                                                </span>

                                                <span>
                                                    Personal information
                                                </span>
                                            </div>
                                            <h3>Tell us about yourself</h3>
                                        </div>

                                        <div className="section-badge">
                                            Step 1
                                        </div>
                                    </div>

                                    <form
                                        className="account-form"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            goToStepTwo();
                                        }}
                                    >
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="fullName">
                                                    Full name
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        A
                                                    </span>

                                                    <input
                                                        id="fullName"
                                                        type="text"
                                                        value={fullName}
                                                        onChange={(e) =>
                                                            setFullName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter your full name"
                                                        autoComplete="name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email">
                                                    Email address
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        @
                                                    </span>

                                                    <input
                                                        id="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="you@example.com"
                                                        autoComplete="email"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password">
                                                    Password
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        •
                                                    </span>

                                                    <input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Create a password"
                                                        autoComplete="new-password"
                                                    />

                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                (value) =>
                                                                    !value,
                                                            )
                                                        }
                                                    >
                                                        {showPassword
                                                            ? "Hide"
                                                            : "Show"}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="confirmPassword">
                                                    Confirm password
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        •
                                                    </span>

                                                    <input
                                                        id="confirmPassword"
                                                        type={
                                                            showConfirmPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={confirmPassword}
                                                        onChange={(e) =>
                                                            setConfirmPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Confirm your password"
                                                        autoComplete="new-password"
                                                    />

                                                    <button
                                                        type="button"
                                                        className="password-toggle"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                (value) =>
                                                                    !value,
                                                            )
                                                        }
                                                    >
                                                        {showConfirmPassword
                                                            ? "Hide"
                                                            : "Show"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                className="primary-button"
                                            >
                                                <span>Continue</span>
                                                <span className="button-arrow">
                                                    →
                                                </span>
                                            </button>
                                        </div>
                                    </form>

                                    <div className="divider">
                                        <span>or continue with</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="google-button"
                                        onClick={handleGoogleSignup}
                                        disabled={googleLoading}
                                    >
                                        {googleLoading ? (
                                            <>
                                                <span className="spinner" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <span className="google-icon">
                                                    G
                                                </span>
                                                Continue with Google
                                            </>
                                        )}
                                    </button>

                                    <p className="step-note">
                                        By continuing, you agree to the terms
                                        and conditions of the inventory
                                        management platform.
                                    </p>
                                </div>
                            </section>
                        ) : (
                            <section className="organization-step">
                                <div className="step-card">
                                    <div className="step-card-header">
                                        <div>
                                            <div className="organization-step-label">
                                                <span className="step-number">
                                                    02
                                                </span>
                                                <span>
                                                    Organization information
                                                </span>
                                            </div>
                                            <h3>Build your workspace</h3>
                                        </div>

                                        <div className="section-badge">
                                            Step 2
                                        </div>
                                    </div>

                                    <form
                                        className="organization-form"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="organization-form-grid">
                                            <div className="form-group">
                                                <label htmlFor="organizationName">
                                                    Organization name
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        O
                                                    </span>

                                                    <input
                                                        id="organizationName"
                                                        type="text"
                                                        value={organizationName}
                                                        onChange={(e) =>
                                                            setOrganizationName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter organization name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="organizationType">
                                                    Organization type
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        T
                                                    </span>

                                                    <select
                                                        id="organizationType"
                                                        value={organizationType}
                                                        onChange={(e) =>
                                                            setOrganizationType(
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Select organization
                                                            type
                                                        </option>
                                                        <option value="retail">
                                                            Retail
                                                        </option>
                                                        <option value="restaurant">
                                                            Restaurant
                                                        </option>
                                                        <option value="wholesale">
                                                            Wholesale
                                                        </option>
                                                        <option value="manufacturing">
                                                            Manufacturing
                                                        </option>
                                                        <option value="warehouse">
                                                            Warehouse
                                                        </option>
                                                        <option value="distribution">
                                                            Distribution
                                                        </option>
                                                        <option value="services">
                                                            Services
                                                        </option>
                                                        <option value="other">
                                                            Other
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="country">
                                                    Country
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        C
                                                    </span>

                                                    <input
                                                        id="country"
                                                        type="text"
                                                        value={country}
                                                        onChange={(e) =>
                                                            setCountry(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter country"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="city">
                                                    City
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        L
                                                    </span>

                                                    <input
                                                        id="city"
                                                        type="text"
                                                        value={city}
                                                        onChange={(e) =>
                                                            setCity(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter city"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="phone">
                                                    Phone number
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        P
                                                    </span>

                                                    <input
                                                        id="phone"
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) =>
                                                            setPhone(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Enter phone number"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="address">
                                                    Address
                                                </label>

                                                <div className="input-wrapper">
                                                    <span className="input-icon">
                                                        A
                                                    </span>

                                                    <input
                                                        id="address"
                                                        type="text"
                                                        value={address}
                                                        onChange={(e) =>
                                                            setAddress(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Business address"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group form-group-full">
                                                <label htmlFor="description">
                                                    Organization description
                                                </label>

                                                <textarea
                                                    id="description"
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Tell us briefly about your organization"
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="organization-actions">
                                            <button
                                                type="button"
                                                className="back-button"
                                                onClick={goBackToStepOne}
                                                disabled={loading}
                                            >
                                                <span>←</span>
                                                Back
                                            </button>

                                            <button
                                                type="submit"
                                                className="primary-button create-button"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>
                                                            Create organization
                                                        </span>
                                                        <span className="button-arrow">
                                                            →
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="organization-footer">
                    <span>Secure workspace setup</span>
                    <span className="footer-dot" />
                    <span>Your data stays protected</span>
                </div>
            </main>
        </div>
    );
};

export default CreateOrganization;
