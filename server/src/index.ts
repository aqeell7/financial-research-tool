import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors"

const PORT = process.env.PORT || 5002
const app: Application = express()

app.use(express.json())
app.use(cors())

app.get('/health', (req:Request, res:Response) => {
  res.json({ status: 'ok' });
});   

app.listen(PORT,()=>{
  console.log(`the server is running at port ${PORT}`)
})