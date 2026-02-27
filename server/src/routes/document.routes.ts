import { Router, type Request, type Response } from "express"
import multer from "multer";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { analyzeEarningsCall } from "../services/ai.service.js";

const router =  Router()
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits:{fileSize: 12*1024*1024}
})

router.post("/upload", upload.single("document"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  console.log("File received:", req.file.originalname);

  try {
    const extractedText = await extractTextFromPDF(req.file.buffer);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({ 
        error: "Unprocessable Entity",
        message: "No readable text found. The document might be a scanned image. Please upload a text-based PDF." 
      });
    }

    const analysisData = await analyzeEarningsCall(extractedText);

    res.json({
      message: "File uploaded, parsed, and analyzed successfully",
      fileName: req.file.originalname,
      size: req.file.size,
      analysisData: analysisData 
    });
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Failed to process the uploaded document" });
  }
});

export default router