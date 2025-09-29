import express from "express";
import cors from "cors";
import { connectDB } from "./connect.js";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import businessRoutes from "./routes/business.routes.js";
import appointmentRoutes from "./routes/appointments.routes.js";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
}).catch((e) => {
    console.error("Mongo connection error:", e);
    process.exit(1);
});
