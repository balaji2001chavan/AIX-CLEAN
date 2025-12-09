console.log("🔥🔥 VOICE ROUTE FILE LOADED 🔥🔥");
import express from "express";
import { detectCountry } from "../engines/global/countryDetect.js";
import { currencyFor } from "../engines/global/currency.js";
import { affiliateSearch } from "../engines/shopping/affiliateSearch.js";
import { b2bSearch } from "../engines/leads/b2bSearch.js";

const router = express.Router();

function detectIntent(text) {
  text = text.toLowerCase();

  if (
    text.includes("buy") ||
    text.includes("cheap") ||
    text.includes("under") ||
    text.includes("electronics") ||
    text.includes("shirt") ||
    text.includes("clothes")
  ) {
    return "SHOPPING";
  }

  if (
    text.includes("bulk") ||
    text.includes("supplier") ||
    text.includes("manufacturer")
  ) {
    return "B2B";
  }

  return "UNKNOWN";
}

router.post("/", (req, res) => {
  const text = req.body.text || "";
  const country = detectCountry(text);
  const currency = currencyFor(country);

  const intent = detectIntent(text);

  // ✅ AUTO MODE ENABLED FOR SHOPPING & B2B
  if (intent === "SHOPPING") {
    const products = affiliateSearch(text, country);
    return res.json({
      heard: text,
      intent,
      auto: true,
      mode: "SHOPPING",
      country,
      currency,
      products
    });
  }

  if (intent === "B2B") {
    const leads = b2bSearch("general", country);
    return res.json({
      heard: text,
      intent,
      auto: true,
      mode: "B2B",
      country,
      leads
    });
  }

  // ❌ FALLBACK (SAFE)
  res.json({
    heard: text,
    intent: "UNKNOWN",
    auto: false,
    message: "Manual approval required"
  });
});

export default router;