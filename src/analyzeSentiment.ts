import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze sentiment using OpenAI API.
 * Returns a score between -1 (very negative) to 1 (very positive).
 */
export async function analyzeSentiment(text: string): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Using GPT-4 for better sentiment analysis
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis assistant. Respond with a single number between -1 (very negative) to 1 (very positive).",
        },
        {
          role: "user",
          content: `Analyze the sentiment of this message: "${text}"`,
        },
      ],
      max_tokens: 10,
      temperature: 0.3, // Lower temperature for more consistent results
    });

    const sentimentText = response.choices[0]?.message.content?.trim() ?? "0";
    const sentimentScore = parseFloat(sentimentText);
    return isNaN(sentimentScore) ? 0 : sentimentScore;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return 0; // Default to neutral sentiment
  }
}
