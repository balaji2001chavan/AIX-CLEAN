/**
 * AIX Super Intelligence – Main Controller
 * Handles:
 * 1) Normal AI chat (Groq LLM)
 * 2) Real file creation (Render /data)
 * 3) GitHub commit + push (approval based)
 */

import fetch from "node-fetch";
import { createFile } from "../tools/file.tool.js";
import { gitCommitAndPush } from "../tools/git.tool.js";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// -----------------------------
// MAIN ENTRY FUNCTION
// -----------------------------
export async function askAI(prompt) {
  if (!prompt) return "❌ Prompt missing";

  const text = prompt.toLowerCase().trim();

  // =============================
  // STEP 1: FILE CREATION INTENT
  // =============================
  if (
    text.includes("file") &&
    (text.includes("तयार") || text.includes("create"))
  ) {
    const result = createFile(
      "aix-demo.txt",
      "हे फाइल AIX ने स्वतः Render server वर तयार केली आहे."
    );

    return (
      "✅ फाइल तयार झाली\n" +
      `📂 Path: ${result.path}\n` +
      `📦 Size: ${result.size} bytes`
    );
  }

  // =============================
  // STEP 2: GITHUB COMMIT REQUEST
  // =============================
  if (
    text.includes("github") &&
    (text.includes("commit") || text.includes("push"))
  ) {
    return (
      "❓ GitHub वर code commit + push करायचा आहे.\n" +
      "Type exactly: YES COMMIT"
    );
  }

  // =============================
  // STEP 3: COMMIT APPROVAL
  // =============================
  if (prompt.trim() === "YES COMMIT") {
    const result = gitCommitAndPush("AIX auto commit");

    if (result.success) {
      return (
        "✅ Code committed and pushed to GitHub\n" +
        "🚀 Render auto-deploy started"
      );
    } else {
      return "⚠️ Commit failed: " + result.message;
    }
  }

  // =============================
  // STEP 4: NORMAL AI RESPONSE
  // =============================
  return await callGroqLLM(prompt);
}

// -----------------------------
// LLM CALL (Groq)
// -----------------------------
async function callGroqLLM(prompt) {
  if (!GROQ_API_KEY) {
    return "❌ GROQ_API_KEY missing in environment variables";
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are AIX Super Intelligence. You can reason, plan, and explain steps clearly in Marathi and English."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "⚠️ No AI reply";

  } catch (err) {
    return "❌ AI request failed: " + err.message;
  }
}
