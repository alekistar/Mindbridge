import { GoogleGenAI } from "@google/genai";
import { CHATBOT_SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private model: string = "gemini-3-flash-preview";

  constructor() {
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.warn("Gemini API Key is missing. Chatbot will mock responses.");
    }
  }

  async sendMessage(history: {role: string, parts: string}[], message: string): Promise<string> {
    if (!this.ai) {
      // Mock response for demo without key
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("I'm sorry, I can't connect to my brain right now (API Key missing), but I'm here to listen. Remember, this is a demo.");
        }, 1000);
      });
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          ...history.map(h => ({
             role: h.role,
             parts: [{ text: h.parts }]
          })),
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction: CHATBOT_SYSTEM_PROMPT,
          maxOutputTokens: 150, // Keep it short as per instructions
        }
      });
      
      return response.text || "I'm listening, but I had trouble thinking of a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();