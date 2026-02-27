import express from "express";
import type { Application, Request, Response } from "express";
import documentRoutes from "./routes/document.routes.js"
import cors from "cors"
import rateLimit from "express-rate-limit"

const PORT = process.env.PORT || 5002
const app: Application = express()

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 20, 
  message: { error: "Too many uploads from this IP, please try again after 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false,
});

app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST"]
}));

app.get('/health', (req:Request, res:Response) => {
  res.json({ status: 'ok' });
});   

app.use("/api/documents", apiLimiter, documentRoutes)

app.listen(PORT,()=>{
  console.log(`the server is running at port ${PORT}`)
})