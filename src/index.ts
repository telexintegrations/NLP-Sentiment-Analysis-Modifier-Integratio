import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { analyzeSentiment } from "./analyzeSentiment";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Telex Modifier Endpoint: Flags toxic messages using OpenAI sentiment analysis.
 */
app.post("/target_url", async (req: Request, res: Response) => {
  try {
    const start = Date.now();
    const { message, settings } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Analyze sentiment
    const score = await analyzeSentiment(message);
    const toxicThreshold =
      settings?.find((s: any) => s.label === "Toxicity Threshold")?.default ??
      -0.5;

    // Modify toxic messages
    let modifiedMessage = message;
    if (score < toxicThreshold) {
      modifiedMessage = `⚠️ Message flagged as toxic: ${message}`;
    }

    // Ensure execution is within 1 second
    if (Date.now() - start > 900) {
      console.warn("Execution took too long, skipping response.");
      return res.status(408).send();
    }

    return res.json({ message: modifiedMessage });
  } catch (error) {
    console.error("Processing error:", error);
    return res.status(500).json({ message: "Error processing message." });
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`✅ Sentiment Modifier running on port ${PORT}`)
);
