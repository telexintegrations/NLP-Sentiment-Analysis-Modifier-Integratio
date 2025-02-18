// index.ts
import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { analyzeSentiment } from "./analyzeSentiment";
import { TelexModifierRequest, TelexModifierResponse } from "./types";

dotenv.config();

const app = express();
const router = Router();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Telex Modifier Integration endpoint for sentiment analysis
 * Follows Telex's modifier integration specifications
 */
router.post(
  "/target_url",
  async (
    req: Request<{}, TelexModifierResponse, TelexModifierRequest>,
    res: Response
  ) => {
    const startTime = Date.now();

    try {
      const { message, settings } = req.body;

      if (!message) {
        return res
          .status(400)
          .json({ message: "Invalid request: message is required" });
      }

      // Get toxicity threshold from settings
      const toxicityThreshold =
        settings?.find((s) => s.label === "Toxicity Threshold")?.default ??
        -0.5;

      // Analyze sentiment (must complete within 1 second)
      const sentimentScore = await analyzeSentiment(message);

      // Check if we're approaching the 1-second timeout
      if (Date.now() - startTime > 900) {
        console.warn("Approaching timeout, returning original message");
        return res.json({ message });
      }

      // Modify message if sentiment is below threshold
      const modifiedMessage =
        sentimentScore < Number(toxicityThreshold)
          ? `⚠️ Potentially harmful message detected (sentiment: ${sentimentScore.toFixed(
              2
            )}): ${message}`
          : message;

      // Return in Telex's required format
      return res.json({ message: modifiedMessage });
    } catch (error) {
      console.error("Error processing message:", error);
      // On error, return original message to not block the chain
      return res.json({ message: req.body.message });
    }
  }
);

app.use(router);

app.listen(PORT, () => {
  console.log(
    `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
  );
});
