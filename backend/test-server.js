import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Test server is running" });
});

app.get("/test", (req, res) => {
    res.json({ message: "Test route works" });
});

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
