import express from "express";
import cors from "cors";
import aixRoute from "./routes/aix.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

app.use("/api/aix", aixRoute);

app.get("/", (req, res) => {
    res.json({ ok: true, msg: "Boss AIX Backend LIVE" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Boss AIX Backend running on port", PORT));
