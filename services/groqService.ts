import { CHATBOT_SYSTEM_PROMPT } from "../constants";

export class GroqService {
  private apiKey: string | null = null;
  private model: string = "llama-3.3-70b-versatile";

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || null;
    if (!this.apiKey) {
      console.warn("Groq API Key is missing. Chatbot will mock responses.");
    }
  }

  async sendMessage(history: {role: string, text: string}[], message: string): Promise<string> {
    if (!this.apiKey) {
      // Mock response for demo without key
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("I'm sorry, I can't connect to my brain right now (Groq API Key missing), but I'm here to listen. Remember, this is a demo.");
        }, 1000);
      });
    }

    try {
      const messages = [
        { role: "system", content: CHATBOT_SYSTEM_PROMPT },
        ...history.map(h => ({
          role: h.role === "model" ? "assistant" : "user",
          content: h.text
        })),
        { role: "user", content: message }
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_completion_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API Error details:", errorData);
        throw new Error(`Groq API responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm listening, but I had trouble thinking of a response.";
    } catch (error) {
      console.error("Groq Service Error:", error);
      return "I'm having trouble connecting to my MindBridge brain right now. Please try again in a moment.";
    }
  }
}

export const groqService = new GroqService();
