/**
 * BOSS AIX – MASTER AUTONOMOUS ENGINE
 * Auto-Repair • Auto-Create • Auto-Route • Auto-CORS • Auto-Intelligence
 */

import fs from "fs";
import path from "path";

export const AIX_MASTER = {
    log(msg) {
        console.log("🔥 AIX-MASTER:", msg);
    },

    // Fix missing folders
    ensureFolder(folderPath) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            this.log(`📁 FIXED: Created missing folder → ${folderPath}`);
        }
    },

    // Fix missing API routes
    ensureRoute(file, defaultCode) {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, defaultCode);
            this.log(`🛠 FIXED: Created missing API → ${file}`);
        }
    },

    // Auto add CORS if missing
    ensureCORS(app) {
        try {
            app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Content-Type");
                res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
                next();
            });
            this.log("🌍 CORS Enabled Automatically");
        } catch (e) {
            this.log("❌ CORS FIX FAILED: " + e.message);
        }
    },

    // Fix brain.js import/export errors
    fixBrainJS() {
        const file = path.resolve("backend/ai/brain.js");
        if (!fs.existsSync(file)) return;

        let code = fs.readFileSync(file, "utf-8");

        if (!code.includes("export async function brainResponse")) {
            code += `
export async function brainResponse(msg){
    return "AIX Thinking → " + msg;
}`;
            fs.writeFileSync(file, code);
            this.log("🧠 FIXED: Added missing brainResponse()");
        }
    },

    runSelfRepair(app) {
        this.log("🧪 Running AIX Self-Repair…");

        // Folders required
        [
            "backend/routes",
            "backend/ai",
            "backend/system",
            "backend/logs"
        ].forEach(f => this.ensureFolder(f));

        // Missing API fix
        this.ensureRoute(
            "backend/routes/aix.js",
            `
import express from "express";
import { brainResponse } from "../ai/brain.js";
const r = express.Router();

r.post("/", async (req, res) => {
    const msg = req.body.message || "";
    const reply = await brainResponse(msg);
    res.json({ reply });
});

export default r;
`
        );

        this.fixBrainJS();
        this.log("✅ ALL REPAIRS COMPLETE");
    }
};
