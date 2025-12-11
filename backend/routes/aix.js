import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const msg = req.body.message || "";

    if (!msg.trim()) {
      return res.json({ reply: "काहीतरी बोला बॉस." });
    }

    // SAMPLE NORMAL AI REPLY (तुझ्यासारखे बोलणारा)
    return res.json({
      reply: `बॉस, मी live आहे. तुम्ही म्हणाल ते मी करायला तयार आहे. तुम्ही म्हणाल तेवढे स्मार्ट होण्याचा प्रयत्न मी करतोय. 😎`,
    });

  } catch (err) {
    return res.status(500).json({ error: "AIX INTERNAL ERROR", details: err });
  }
});

export default router;
