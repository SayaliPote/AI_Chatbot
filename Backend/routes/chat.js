import express from "express";
import Thread from "../models/Thread.js";
import requireAuth from "../middleware/auth.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// every route below needs a logged-in user, and only touches that user's threads
router.use(requireAuth);

//Get all threads of the logged-in user
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 });
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId, user: req.user._id });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, user: req.user._id });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (thread && (!thread.user || !thread.user.equals(req.user._id))) {
            // threadId belongs to someone else (or is an old chat saved before login existed)
            return res.status(403).json({ error: "Not allowed" });
        }

        if (!thread) {
            //create a new thread in Db
            thread = new Thread({
                user: req.user._id,
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // send the last 20 messages so the model remembers the conversation
        const history = thread.messages.slice(-20).map((m) => ({
            role: m.role,
            content: m.content
        }));

        const assistantReply = await getOpenAIAPIResponse(history);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }
});

export default router;
