import { useEffect, useState } from "react";
import { apiFetch } from "./api.js";
import { useAuth } from "./authState.js";
import "./Profile.css";

function Profile({ onClose }) {
    const { user, setUser, logout } = useAuth();
    const [name, setName] = useState(user.name);
    const [chatCount, setChatCount] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const loadCount = async () => {
            const res = await apiFetch("/api/auth/me");
            if (res.ok) setChatCount(res.data.chatCount);
        };
        loadCount();
    }, []);

    const showMessage = (type, text) => setMessage({ type, text });

    const saveName = async (e) => {
        e.preventDefault();
        const res = await apiFetch("/api/auth/profile", {
            method: "PUT",
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            setUser(res.data.user);
            showMessage("success", "Name updated");
        } else {
            showMessage("error", res.data?.error || "Could not update name");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        const res = await apiFetch("/api/auth/password", {
            method: "PUT",
            body: JSON.stringify({ currentPassword, newPassword })
        });
        if (res.ok) {
            setCurrentPassword("");
            setNewPassword("");
            showMessage("success", "Password updated");
        } else {
            showMessage("error", res.data?.error || "Could not change password");
        }
    };

    const deleteAccount = async () => {
        const sure = window.confirm("Delete your account and all your chats? This cannot be undone.");
        if (!sure) return;
        const res = await apiFetch("/api/auth/account", { method: "DELETE" });
        if (res.ok) {
            logout();
        } else {
            showMessage("error", res.data?.error || "Could not delete account");
        }
    };

    const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="profileOverlay" onClick={onClose}>
            <div className="profileCard" onClick={(e) => e.stopPropagation()}>
                <div className="profileHeader">
                    <h2>My Profile</h2>
                    <i className="fa-solid fa-xmark profileClose" onClick={onClose}></i>
                </div>

                <p className="profileMeta">{user.email}</p>
                <p className="profileMeta">
                    Member since {memberSince}
                    {chatCount !== null && ` · ${chatCount} chat${chatCount === 1 ? "" : "s"}`}
                </p>

                {message.text && (
                    <p className={message.type === "error" ? "profileError" : "profileSuccess"}>
                        {message.text}
                    </p>
                )}

                <form onSubmit={saveName}>
                    <label>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                    <button type="submit">Save name</button>
                </form>

                <form onSubmit={changePassword}>
                    <label>Change password</label>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New password (min 6 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Update password</button>
                </form>

                <button className="dangerButton" onClick={deleteAccount}>
                    Delete account
                </button>
            </div>
        </div>
    );
}

export default Profile;
