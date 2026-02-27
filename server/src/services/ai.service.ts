import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const analyzeEarningsCall = async (transcriptText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an expert financial analyst. Extract specific insights from earnings call transcripts.
      CRITICAL INSTRUCTIONS:
      1. ONLY use information explicitly stated in the transcript. Do not hallucinate.
      2. If a specific metric or initiative is not mentioned, return "Not mentioned" or an empty array.
      3. Base the 'tone' and 'confidence_level' strictly on the language used by management.`,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            tone: { 
              type: SchemaType.STRING, 
              description: "Management tone (e.g., optimistic, cautious, neutral, pessimistic)" 
            },
            confidence_level: { 
              type: SchemaType.STRING, 
              description: "Confidence level (e.g., high, medium, low)" 
            },
            key_concerns: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING }, 
              description: "3-5 key concerns or challenges" 
            },
            key_positives: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING }, 
              description: "3-5 key positives mentioned" 
            },
            forward_guidance: { 
              type: SchemaType.STRING, 
              description: "Forward guidance regarding revenue, margin, or capex" 
            },
            capacity_utilization: { 
              type: SchemaType.STRING, 
              description: "Capacity utilization trends" 
            },
            growth_initiatives: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING }, 
              description: "2-3 new growth initiatives described" 
            }
          },
          required: ["tone", "confidence_level", "key_concerns", "key_positives", "forward_guidance", "capacity_utilization", "growth_initiatives"],
        },
      },
    });

    const prompt = `Please analyze this transcript and extract the required data:\n\n${transcriptText}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return JSON.parse(responseText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze transcript with AI");
  }
};