import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { AIX_MASTER } from "./aix.master.engine.js";

const app = express();
app.use(express.json());
app.use(cors());

// RUN MASTER AUTO FIX
AIX_MASTER.runSelfRepair(app);

// AUTO LOAD ROUTES
import aixRoute from "./routes/aix.js";
app.use("/api/aix", aixRoute);

app.get("/", (req, res) => {
    res.json({
        ok: true,
        msg: "🔥 Boss AIX Backend LIVE",
        time: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 BOSS AIX BACKEND LIVE on ${PORT}`);
});
