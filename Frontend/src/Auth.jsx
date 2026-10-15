import { useState } from "react";
import { useAuth } from "./authState.js";
import "./Auth.css";

function Auth() {
    const { login, signup } = useAuth();
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const isSignup = mode === "signup";

    const switchMode = () => {
        setMode(isSignup ? "login" : "signup");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        const result = isSignup
            ? await signup(name, email, password)
            : await login(email, password);
        setBusy(false);
        if (!result.ok) setError(result.error);
    };

    return (
        <div className="authPage">
            <form className="authCard" onSubmit={handleSubmit}>
                <h1>AI Chatbot</h1>
                <p className="authSub">{isSignup ? "Create your account" : "Log in to continue"}</p>

                {isSignup && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={isSignup ? "Password (min 6 characters)" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="authError">{error}</p>}

                <button type="submit" className="authButton" disabled={busy}>
                    {busy ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
                </button>

                <p className="authSwitch">
                    {isSignup ? "Already have an account?" : "New here?"}{" "}
                    <span onClick={switchMode}>{isSignup ? "Log in" : "Create an account"}</span>
                </p>
            </form>
        </div>
    );
}

export default Auth;
