import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js"
import noteRoutes from "./routes/note.routes.js"
import {verifyToken} from "./middlewares/authMiddleware.js"
import cookieParser from "cookie-parser";

const app = express();
const PORT = Number(process.env.PORT) || 8000;

console.log(`Server starting on port ${PORT}`);
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:   FRONTEND_URL || "http://localhost:5173",
  credentials: true           
}));
 
 
// Root route
app.get("/", (req, res) => {
  res.send({ success: true });
});

app.get("/hello", (req, res) => {
  res.send({ msg: "hello" });
});

// Route definitions
app.use("/api/auth", authRoutes); 
app.use("/api/user", userRoutes); 
app.use("/api/note",verifyToken, noteRoutes); 


// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`--> Server running at port ${PORT}`);
});
