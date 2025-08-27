import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/orders.js";
import expressLayouts from "express-ejs-layouts";

dotenv.config();
connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing middleware

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(flash());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

// Use layouts
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // default layout


// Make user + messages available globally
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

app.use("/books", bookRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/orders", orderRoutes);
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
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
