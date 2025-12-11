import express from "express";
import cors from "cors";
import aixRoute from "./routes/aix.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// DEFAULT ROUTE CHECK
app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

// MAIN AIX API
app.use("/api/aix", aixRoute);

app.listen(PORT, () => {
    console.log("Boss AIX Backend Running on PORT", PORT);
});
