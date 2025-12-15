import { findProducts } from "../services/productSearch.service.js";

export async function searchProducts(req, res) {
  try {
    const { query, budget, categories, language } = req.body;

    const results = await findProducts({
      query,
      budget,
      categories
    });

    return res.json({
      reply: "आजच्या लाईव्ह रेटनुसार योग्य पर्याय खाली दिले आहेत 👇",
      confidence: "High",
      fetchedAt: new Date().toISOString(),
      items: results,
      nextActions: ["Open", "Compare", "Create Post"]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Market search failed" });
  }
}
