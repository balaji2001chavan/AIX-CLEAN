import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const msg = req.body.message || "";

        if (!msg) {
            return res.json({ reply: "काय म्हणताय Boss? काही बोला ☕" });
        }

        // BASIC AI REPLY (like GPT) – upgrade करू शकतो पुढे
        const reply = `Boss, मी fully active आहे. तुम्ही म्हणाल ते मी करीन. तुम्ही म्हणाल: "${msg}" — आणि मी त्यावर काम सुरू करतो.`;

        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
