import { buildGitHubApplyPlan } from "./github.apply.service.js";

export async function approveChange(req, res) {
  try {
    const { plan, change } = req.body;

    if (!plan || !change) {
      return res.status(400).json({
        success: false,
        error: "Approval data missing"
      });
    }

    const githubPlan = buildGitHubApplyPlan(plan, change);

    return res.json({
      success: true,
      message: "Approval मिळाली आहे. GitHub apply plan तयार आहे.",
      githubPlan
    });

  } catch (err) {
    console.error("APPROVAL ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Approval process failed"
    });
  }
}
