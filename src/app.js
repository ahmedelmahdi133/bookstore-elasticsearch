import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/orders.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// Enable CORS for React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing middleware

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Export for Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
