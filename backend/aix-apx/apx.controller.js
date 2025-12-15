import { verifyAIXKey } from "./apx.auth.js";
import { apxThink } from "./apx.logic.js";

/* reuse existing executors */
import { generateRealImage } from "../aix-core/executors/media/realImageGenerator.js";
import { searchKnowledge } from "../aix-core/executors/knowledge/searchKnowledge.js";

export async function aixApxController(req, res) {
  try {
    const keyData = verifyAIXKey(req);
    if (!keyData.allowed) {
      return res.status(403).json({ error: keyData.reason });
    }

    const message = req.body.message || "";
    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const thought = apxThink(message);

    /* controlled execution */
    if (thought.intent === "image") {
      const img = await generateRealImage(message);
      return res.json({
        success: true,
        plan: keyData.plan,
        reply: "इमेज तयार केली आहे",
        imageUrl: img
      });
    }

    if (thought.intent === "general") {
      const data = await searchKnowledge(message);
      return res.json({
        success: true,
        plan: keyData.plan,
        reply: data.summary,
        sources: data.sources
      });
    }

    return res.json({
      success: true,
      plan: keyData.plan,
      reply: `
मी तुमचं म्हणणं समजून घेतलं आहे.
विषय: ${thought.intent}

पुढे काय करायचं ते सांगा.
      `
    });

  } catch (err) {
    console.error("AIX APX ERROR:", err);
    res.status(500).json({ error: "AIX APX internal error" });
  }
  }
