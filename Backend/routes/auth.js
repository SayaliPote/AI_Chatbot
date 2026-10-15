import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Thread from "../models/Thread.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const name = (req.body.name || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: "Enter a valid email address" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });

        res.status(201).json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Signup failed" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";

        const user = await User.findOne({ email });
        // same message for both cases so we don't reveal which emails exist
        const valid = user && (await bcrypt.compare(password, user.passwordHash));

        if (!valid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// GET /api/auth/me  -> current user (used to restore session on page refresh)
router.get("/me", requireAuth, async (req, res) => {
    const chatCount = await Thread.countDocuments({ user: req.user._id });
    res.json({ user: publicUser(req.user), chatCount });
});

// PUT /api/auth/profile  -> update name
router.put("/profile", requireAuth, async (req, res) => {
    try {
        const name = (req.body.name || "").trim();
        if (!name) {
            return res.status(400).json({ error: "Name cannot be empty" });
        }

        req.user.name = name;
        await req.user.save();
        res.json({ user: publicUser(req.user) });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// PUT /api/auth/password  -> change password
router.put("/password", requireAuth, async (req, res) => {
    try {
        const { currentPassword = "", newPassword = "" } = req.body;

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.user._id);
        const ok = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: "Password updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to change password" });
    }
});

// DELETE /api/auth/account  -> delete account and all of its chats
router.delete("/account", requireAuth, async (req, res) => {
    try {
        await Thread.deleteMany({ user: req.user._id });
        await User.findByIdAndDelete(req.user._id);
        res.json({ success: "Account deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

export default router;
