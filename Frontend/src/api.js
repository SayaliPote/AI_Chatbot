// Central place for talking to the backend.
// Set VITE_API_URL in Frontend/.env when the backend is deployed; defaults to local.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const TOKEN_KEY = "aichatbot_token";

export const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

export const setToken = (token) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* storage blocked - user will need to log in again after refresh */
    }
};

export const clearToken = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch {
        /* ignore */
    }
};

// fetch wrapper: adds the JWT header, parses JSON, and tells the app when the token is invalid
export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const response = await fetch(`${API_URL}${path}`, { ...options, headers });
        let data = null;
        try {
            data = await response.json();
        } catch {
            /* response had no JSON body */
        }

        if (response.status === 401 && token) {
            window.dispatchEvent(new Event("auth:expired"));
        }
        return { ok: response.ok, status: response.status, data };
    } catch (err) {
        console.log(err);
        return { ok: false, status: 0, data: { error: "Cannot reach the server. Is the backend running?" } };
    }
}
