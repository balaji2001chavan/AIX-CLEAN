import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
}));

import aixRoute from "./routes/aix.js";
app.use("/api/aix", aixRoute);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

app.listen(PORT, () => {
    console.log("Boss AIX Backend running on " + PORT);
});
