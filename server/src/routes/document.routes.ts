import { Router, type Request, type Response } from "express"
import multer from "multer";

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits:{fileSize: 12*1024*1024}
})

router.post("/upload", upload.single("document"),(req: Request, res:Response)=>{

  if(!req.file){
    res.status(400).json({error: "NO file uploaded"})
    return;
  }

  console.log("File received:", req.file.originalname)

  res.json({
    message: "File uploaded successfully to memory",
    fileName: req.file.originalname,
    size: req.file.size
  })
})

export default router