// ai/ask.routes.js
import express from "express";
import { spawn } from "child_process";
import path from "path";
import os from "os";

export const router = express.Router();

const OLLAMA = process.env.OLLAMA_PATH || path.join(process.env.USERPROFILE || "", "AppData","Local","Programs","Ollama","ollama.exe");
// timeout for model (ms)
const MODEL_TIMEOUT = Number(process.env.MODEL_TIMEOUT_MS || 120000);

router.post("/ask", (req, res) => {
  const { prompt = "", userId = "anonymous" } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "missing prompt" });

  // pick model list preference - try smaller first if memory is low
  const modelsToTry = [
    "llama3.2:1b",
    "llama2:latest",
    "phi3:mini"
  ];

  // helper to run a single model attempt
  const runModel = (model) => {
    return new Promise((resolve) => {
      // spawn args array (avoids quoting hell)
      const args = ["run", model, prompt];
      console.log("[engine] spawn:", OLLAMA, args.join(" "));
      const child = spawn(OLLAMA, args, { windowsHide: true });

      let out = "";
      let err = "";
      let finished = false;

      const killTimer = setTimeout(() => {
        if (!finished) {
          finished = true;
          child.kill("SIGTERM");
          resolve({ ok: false, reason: "timeout", stderr: err || "timed out" });
        }
      }, MODEL_TIMEOUT);

      child.stdout.on("data", (d) => { out += String(d); });
      child.stderr.on("data", (d) => { err += String(d); });

      child.on("error", (e) => {
        if (!finished) {
          finished = true;
          clearTimeout(killTimer);
          resolve({ ok: false, reason: "spawn-error", stderr: String(e) });
        }
      });

      child.on("close", (code, signal) => {
        if (!finished) {
          finished = true;
          clearTimeout(killTimer);
          if (code === 0) resolve({ ok: true, out: out.trim() });
          else resolve({ ok: false, reason: `exit-${code}`, stderr: err.trim() || out.trim() });
        }
      });
    });
  };

  (async () => {
    for (const m of modelsToTry) {
      const attempt = await runModel(m);
      console.log("[engine] attempt", m, attempt);
      if (attempt.ok) {
        return res.json({ reply: attempt.out });
      }
      // if failed, try next model
    }
    // all failed
    return res.json({ reply: "ENGINE ERROR: all models failed or timed out. Check Ollama CLI, available models and memory." });
  })().catch(e => {
    console.error("ask route fatal:", e);
    return res.json({ reply: "ENGINE ERROR: internal" });
  });
});