import express, { Request, Response } from "express";
import cors from "cors";
import { OpenAI } from "openai";
import "dotenv/config"; // Load environment variables from .env

// Load environment variables
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Endpoint to analyze sentiment
app.post("/analyze-sentiment", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Send the message to OpenAI for sentiment analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Analyze sentiment: ${message}` }],
    });

    // Extract the sentiment from the response
    const sentiment = response.choices[0]?.message?.content.trim() || "Unknown";

    // Return modified message (for Telex)
    res.json({ message: sentiment });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
