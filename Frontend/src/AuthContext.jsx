import { useEffect, useState, useCallback } from "react";
import { apiFetch, getToken, setToken, clearToken } from "./api.js";
import { AuthContext } from "./authState.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while we check a saved token

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
    }, []);

    // restore the session after a page refresh
    useEffect(() => {
        const restore = async () => {
            if (!getToken()) {
                setLoading(false);
                return;
            }
            const res = await apiFetch("/api/auth/me");
            if (res.ok) {
                setUser(res.data.user);
            } else {
                clearToken();
            }
            setLoading(false);
        };
        restore();
    }, []);

    // apiFetch fires this event when the server says the token is invalid/expired
    useEffect(() => {
        window.addEventListener("auth:expired", logout);
        return () => window.removeEventListener("auth:expired", logout);
    }, [logout]);

    const authenticate = async (path, body) => {
        const res = await apiFetch(path, { method: "POST", body: JSON.stringify(body) });
        if (res.ok) {
            setToken(res.data.token);
            setUser(res.data.user);
            return { ok: true };
        }
        return { ok: false, error: res.data?.error || "Something went wrong" };
    };

    const login = (email, password) => authenticate("/api/auth/login", { email, password });
    const signup = (name, email, password) => authenticate("/api/auth/signup", { name, email, password });

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
