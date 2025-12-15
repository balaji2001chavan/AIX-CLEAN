import express from "express";
import cors from "cors";

import { aixBrain } from "./aix-brain/aixBrain.js";
import { wrapReply } from "./core/persona/aixPersona.js";
import { findProducts } from "./services/productSearch.service.js";

const app = express();
app.use(cors());
app.use(express.json());

// simple memory (phase-1)
let memory = {
  lastProposal: null
};

app.get("/", (req, res) => {
  res.send("AIX CORE LIVE");
});

app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "";
    const decision = aixBrain({ message, memory });

    // Advisor / explain
    if (decision.mode === "EXPLAIN") {
      return res.json({ reply: decision.reply });
    }

    // Proposal (ask permission)
    if (decision.mode === "PROPOSE") {
      memory.lastProposal = decision.proposal;
      return res.json({ reply: decision.reply });
    }

    // Action (only after permission)
    if (
      decision.mode === "ACT" &&
      memory.lastProposal?.type === "PRODUCT_SEARCH"
    ) {
      const items = await findProducts({
        budget: 300,
        categories: ["fashion", "kids", "gadgets"]
      });

      memory.lastProposal = null;

      return res.json({
        reply: wrapReply({
          message:
            "ठीक आहे बॉस. मी लाईव्ह प्रॉडक्ट्स आणले आहेत. खाली क्लिक करून थेट स्क्रीन उघडू शकता."
        }),
        items
      });
    }

    return res.json({
      reply: wrapReply({
        message: "थोडं स्पष्ट करूया बॉस—काय करायचं ते सांगा."
      })
    });
  } catch (e) {
    return res.status(500).json({
      reply: "थोडी अडचण आली बॉस. पुन्हा प्रयत्न करूया."
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("AIX Backend LIVE on port", PORT)
);
