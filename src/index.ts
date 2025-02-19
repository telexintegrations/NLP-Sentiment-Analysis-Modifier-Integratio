// index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { analyzeSentiment } from "./analyzeSentiment";
import { TelexRequest, TelexResponse } from "./types";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post(
  "/format-message",
  async (req: TelexRequest, res: TelexResponse): Promise<void> => {
    const startTime = Date.now();

    try {
      const { message, settings, channel_id } = req.body;

      // Validate required fields
      if (!message) {
        res
          .status(400)
          .json({ message: "Invalid request: message is required" });
        return;
      }

      if (!channel_id) {
        res
          .status(400)
          .json({ message: "Invalid request: channel_id is required" });
        return;
      }

      const toxicityThreshold =
        settings?.find((s) => s.label === "Toxicity Threshold")?.default ??
        -0.5;

      // Check timeout early
      if (Date.now() - startTime > 900) {
        console.warn("Approaching timeout, returning original message");
        res.json({ message });
        return;
      }

      const sentimentScore = await analyzeSentiment(message);

      // Calculate the modified message before using it
      const modifiedMessage =
        sentimentScore < Number(toxicityThreshold)
          ? `⚠️ Potentially harmful message detected (sentiment: ${sentimentScore.toFixed(
              2
            )}): ${message}`
          : message;

      res.json({
        message: modifiedMessage,
        metadata: {
          processed: true,
          sentiment_score: sentimentScore,
          processing_time: Date.now() - startTime,
        },
      });
    } catch (error: any) {
      // Type assertion for error
      console.error("Error processing message:", error);
      res.status(500).json({
        error: "Processing failed",
        code: "PROCESSING_ERROR",
        details: error?.message || "Unknown error occurred",
      });
    }
  }
);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(
    `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
  );
});

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { analyzeSentiment } from "./analyzeSentiment";
// import { TelexRequest, TelexResponse } from "./types";

// dotenv.config();

// const app = express();

// // Add middleware
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// // Define the route directly on app
// app.post(
//   "/target_url",
//   async (req: TelexRequest, res: TelexResponse): Promise<any> => {
//     const startTime = Date.now();

//     try {
//       const { message, settings } = req.body;

//       if (!message) {
//         return res
//           .status(400)
//           .json({ message: "Invalid request: message is required" });
//       }

//       const toxicityThreshold =
//         settings?.find((s) => s.label === "Toxicity Threshold")?.default ??
//         -0.5;
//       const sentimentScore = await analyzeSentiment(message);

//       if (Date.now() - startTime > 900) {
//         console.warn("Approaching timeout, returning original message");
//         return res.json({ message });
//       }

//       const modifiedMessage =
//         sentimentScore < Number(toxicityThreshold)
//           ? `⚠️ Potentially harmful message detected (sentiment: ${sentimentScore.toFixed(
//               2
//             )}): ${message}`
//           : message;

//       return res.json({ message: modifiedMessage });
//     } catch (error) {
//       console.error("Error processing message:", error);
//       return res.json({ message: req.body.message });
//     }
//   }
// );

// // Add a test endpoint
// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// app.listen(PORT, () => {
//   console.log(
//     `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
//   );
// });
