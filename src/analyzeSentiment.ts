// analyzeSentiment.ts
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
      model: "gpt-3.5-turbo",
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

    // Validate the sentiment score
    if (isNaN(sentimentScore) || sentimentScore < -1 || sentimentScore > 1) {
      console.warn("Invalid sentiment score received:", sentimentText);
      return 0; // Return neutral sentiment for invalid scores
    }

    return sentimentScore;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Log more details about the error for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    return 0; // Default to neutral sentiment on error
  }
}
