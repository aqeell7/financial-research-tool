import { createRequire } from "module";

const require = createRequire(import.meta.url);
const extract = require("pdf-extraction");

const sanitizeText = (rawText: string): string => {
  if (!rawText) return "";
  return rawText
    .replace(/\s{2,}/g, ' ') 
    .replace(/\n+/g, '\n')   
    .trim();
};

export const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const data = await extract(pdfBuffer);
    return sanitizeText(data.text);
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from document");
  }
};