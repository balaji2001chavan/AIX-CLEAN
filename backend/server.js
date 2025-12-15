
import express from "express";
import cors from "cors";

import { aixBrain } from "./aix-brain/aixBrain.js";
import { findProducts } from "./services/productSearch.service.js";
import { wrapReply } from "./core/persona/aixPersona.js";

const app = express();
app.use(cors());
app.use(express.json());

/* =======================
   MAIN AIX CHAT ENDPOINT
======================= */
import { aixBrain } from "./aix-brain/aixBrain.js";
import { findProducts } from "./services/productSearch.service.js";
import { wrapReply } from "./core/persona/aixPersona.js";
let memory = {
  lastProposal: null
};
app.post("/api/aix", async (req, res) => {
  const message = req.body.message || "";
  const decision = aixBrain({ message, memory });

  if (decision.mode === "EXPLAIN") {
    return res.json({ reply: decision.reply });
  }

  if (decision.mode === "PROPOSE") {
    memory.lastProposal = decision.proposal;
    return res.json({ reply: decision.reply });
  }

  if (decision.mode === "ACT" && memory.lastProposal?.type === "PRODUCT_SEARCH") {
    const items = await findProducts({
      query: message,
      budget: 300,
      categories: ["fashion", "gadgets", "kids"]
    });

    memory.lastProposal = null;

    return res.json({
      reply: wrapReply({
        message:
          "ठीक आहे बॉस. मी लाईव्ह प्रॉडक्ट्स आणले आहेत. खाली बघा."
      }),
      items
    });
  }

  return res.json({
    reply: wrapReply({
      message: "थोडं स्पष्ट करूया बॉस—काय करायचं ते सांगा."
    })
  });
});
let lastProposal = null; // साधी memory (Phase-1)

app.post("/api/aix", async (req, res) => {
  const message = req.body.message || "";
  const decision = aixBrain({ message });

  if (decision.state === "ADVISE") {
    return res.json({ reply: decision.reply });
  }

  if (decision.state === "PROPOSE") {
    lastProposal = decision.proposal;
    return res.json({ reply: decision.reply });
  }

  if (decision.state === "ACT" && lastProposal?.type === "PRODUCT_SEARCH") {
    const items = await findProducts({
      query: message,
      budget: 300,
      categories: ["fashion", "gadgets", "kids"]
    });
    lastProposal = null;
    return res.json({
      reply: wrapReply({
        message:
          "ठीक आहे बॉस. मी लाईव्ह प्रॉडक्ट्स आणले आहेत. थेट स्क्रीन उघडू शकता."
      }),
      items
    });
  }

  return res.json({
    reply: wrapReply({
      message: "थोडं स्पष्ट करूया बॉस—काय करायचं ते सांगाल?"
    })
  });
});
app.post("/api/aix", async (req, res) => {
  try {
    const message = req.body.message || "";
app.post("/api/aix-apx", (req, res) => {
  // same handler as /api/aix
  return res.redirect(307, "/api/aix");
});
    // 🧠 AIX BRAIN decides
    const decision = aixBrain({ message });

    /* 🗣️ NORMAL TALK */
    if (decision.type === "talk") {
      return res.json({
        reply: decision.reply
      });
    }

    /* 🛍️ PRODUCT SEARCH ACTION */
    if (decision.type === "action" && decision.action === "PRODUCT_SEARCH") {

      const products = await findProducts({
        query: message,
        budget: 300,
        categories: ["fashion", "gadgets", "kids"]
      });

      return res.json({
        reply: wrapReply({
          message:
            "बरं बॉस 👍 आजच्या लाईव्ह रेटनुसार योग्य प्रॉडक्ट्स निवडले आहेत. खाली बघा."
        }),
        items: products
      });
    }

    /* FALLBACK */
    return res.json({
      reply: wrapReply({
        message:
          "मी समजून घेतोय बॉस, पण यावर थोडं स्पष्ट सांगाल का?"
      })
    });

  } catch (err) {
    console.error("AIX ERROR:", err);
    return res.status(500).json({
      reply: wrapReply({
        message: "थोडी अडचण आली बॉस. पुन्हा प्रयत्न करूया."
      })
    });
  }
});

/* =======================
   SERVER START
======================= */
const PORT = 10000;
app.listen(PORT, () => {
  console.log("AIX Backend LIVE on port", PORT);
});
