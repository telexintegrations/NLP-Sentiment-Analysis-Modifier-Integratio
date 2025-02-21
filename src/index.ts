import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { analyzeSentiment } from "./analyzeSentiment";
import {
  TelexRequest,
  TelexResponse,
  TelexErrorCode,
  TelexModifierResponse,
  TelexErrorResponse,
} from "./types";

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
      const { message, settings, channel_id, target_url } = req.body;

      // Validate required fields
      if (!message) {
        const errorResponse: TelexErrorResponse = {
          error: "Invalid request: message is required",
          code: TelexErrorCode.INVALID_MESSAGE,
          details: "Message field cannot be empty",
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (!channel_id) {
        const errorResponse: TelexErrorResponse = {
          error: "Invalid request: channel_id is required",
          code: TelexErrorCode.INVALID_CHANNEL,
          details: "Channel ID field cannot be empty",
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(errorResponse);
        return;
      }

      if (!target_url) {
        const errorResponse: TelexErrorResponse = {
          error: "Invalid request: target_url is required",
          code: TelexErrorCode.INVALID_TARGET_URL,
          details: "Target URL field cannot be empty",
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Check timeout early
      if (Date.now() - startTime > 900) {
        const errorResponse: TelexErrorResponse = {
          error: "Request timeout",
          code: TelexErrorCode.TIMEOUT_ERROR,
          details: "Processing time exceeded limit",
          timestamp: new Date().toISOString(),
        };
        res.status(408).json(errorResponse);
        return;
      }

      const toxicityThreshold =
        settings?.find((s) => s.label === "Toxicity Threshold")?.default ??
        -0.5;

      const sentimentScore = await analyzeSentiment(message);

      // Calculate the modified message
      const modifiedMessage =
        sentimentScore < Number(toxicityThreshold)
          ? `⚠️ Potentially harmful message detected (sentiment: ${sentimentScore.toFixed(
              2
            )}): ${message}`
          : message;

      const response: TelexModifierResponse = {
        message: modifiedMessage,
        metadata: {
          processed: true,
          sentiment_score: sentimentScore,
          processing_time: Date.now() - startTime,
          channel_id,
          target_url,
          timestamp: new Date().toISOString(),
          sensitivity_level: sentimentScore.toString(),
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorResponse: TelexErrorResponse = {
        error: "Processing failed",
        code: TelexErrorCode.API_ERROR,
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  }
);

// Health check endpoint
app.get("/health", (_req, res: TelexResponse) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(
    `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
  );
});

// // index.ts
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import rateLimit from "express-rate-limit";
// import { analyzeSentiment } from "./analyzeSentiment";
// import {
//   TelexRequest,
//   TelexResponse,
//   TelexModifierRequest,
//   TelexErrorCode,
//   isValidRequest,
//   isValidUrl,
// } from "./types";

// dotenv.config();

// const app = express();
// const REQUEST_TIMEOUT = 1000; // 1 second timeout for full request processing

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });

// app.use(limiter);
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// // Middleware to validate request body
// const validateRequest = (
//   req: TelexRequest,
//   res: TelexResponse,
//   next: Function
// ) => {
//   const { message, channel_id, target_url } = req.body as TelexModifierRequest;

//   if (!message || typeof message !== "string") {
//     res.status(400).json({
//       error: "Invalid request",
//       code: TelexErrorCode.INVALID_MESSAGE,
//       details: "Message is required and must be a string",
//       timestamp: new Date().toISOString(),
//     });
//     return;
//   }

//   if (!channel_id || typeof channel_id !== "string") {
//     res.status(400).json({
//       error: "Invalid request",
//       code: TelexErrorCode.INVALID_CHANNEL,
//       details: "Channel ID is required and must be a string",
//       timestamp: new Date().toISOString(),
//     });
//     return;
//   }

//   if (!target_url || !isValidUrl(target_url)) {
//     res.status(400).json({
//       error: "Invalid request",
//       code: TelexErrorCode.INVALID_TARGET_URL,
//       details: "Target URL is required and must be a valid URL",
//       timestamp: new Date().toISOString(),
//     });
//     return;
//   }

//   if (!isValidRequest(req.body)) {
//     res.status(400).json({
//       error: "Invalid request format",
//       code: TelexErrorCode.PROCESSING_ERROR,
//       details: "Request body does not match required format",
//       timestamp: new Date().toISOString(),
//     });
//     return;
//   }

//   next();
// };

// app.post(
//   "/format-message",
//   validateRequest,
//   async (req: TelexRequest, res: TelexResponse): Promise<void> => {
//     const startTime = Date.now();

//     try {
//       const { message, settings, channel_id, target_url } =
//         req.body as TelexModifierRequest;

//       // Check timeout early
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Request timeout")), REQUEST_TIMEOUT)
//       );

//       const toxicityThreshold =
//         settings?.find((s) => s.label === "Toxicity Threshold")?.default ??
//         -0.5;

//       const [sentimentScore] = (await Promise.race([
//         Promise.all([analyzeSentiment(message)]),
//         timeoutPromise,
//       ])) as [number]; // Explicitly type the resolved value as an array

//       const modifiedMessage =
//         sentimentScore < Number(toxicityThreshold)
//           ? `⚠️ Potentially harmful message detected (sentiment: ${sentimentScore.toFixed(
//               2
//             )}): ${message}`
//           : message;

//       const processingTime = Date.now() - startTime;

//       res.json({
//         message: modifiedMessage,
//         metadata: {
//           processed: true,
//           sentiment_score: sentimentScore,
//           processing_time: processingTime,
//           channel_id,
//           target_url,
//           timestamp: new Date().toISOString(),
//         },
//       });
//     } catch (error) {
//       console.error("Error processing message:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";

//       res.status(500).json({
//         error: "Processing failed",
//         code: TelexErrorCode.PROCESSING_ERROR,
//         details: errorMessage,
//         timestamp: new Date().toISOString(),
//       });
//     }
//   }
// );

// // Health check endpoint with basic system status
// app.get("/health", (_req, res) => {
//   res.json({
//     status: "ok",
//     version: "1.0.0",
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     timestamp: new Date().toISOString(),
//   });
// });

// app.listen(PORT, () => {
//   console.log(
//     `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
//   );
// });

//!0000000000000000
// index.ts
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { analyzeSentiment } from "./analyzeSentiment";
// import { TelexRequest, TelexResponse } from "./types";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// app.post(
//   "/format-message",
//   async (req: TelexRequest, res: TelexResponse): Promise<void> => {
//     const startTime = Date.now();

//     try {
//       const { message, settings, channel_id } = req.body;

//       // Validate required fields
//       if (!message) {
//         res
//           .status(400)
//           .json({ message: "Invalid request: message is required" });
//         return;
//       }

//       if (!channel_id) {
//         res
//           .status(400)
//           .json({ message: "Invalid request: channel_id is required" });
//         return;
//       }

//       const toxicityThreshold =
//         settings?.find((s) => s.label === "Toxicity Threshold")?.default ??
//         -0.5;

//       // Check timeout early
//       if (Date.now() - startTime > 900) {
//         console.warn("Approaching timeout, returning original message");
//         res.json({ message });
//         return;
//       }

//       const sentimentScore = await analyzeSentiment(message);

//       // Calculate the modified message before using it
//       const modifiedMessage =
//         sentimentScore < Number(toxicityThreshold)
//           ? `⚠️ Potentially harmful message detected (sentiment: ${sentimentScore.toFixed(
//               2
//             )}): ${message}`
//           : message;

//       res.json({
//         message: modifiedMessage,
//         metadata: {
//           processed: true,
//           sentiment_score: sentimentScore,
//           processing_time: Date.now() - startTime,
//         },
//       });
//     } catch (error: any) {
//       // Type assertion for error
//       console.error("Error processing message:", error);
//       res.status(500).json({
//         error: "Processing failed",
//         code: "PROCESSING_ERROR",
//         details: error?.message || "Unknown error occurred",
//       });
//     }
//   }
// );

// // Health check endpoint
// app.get("/health", (_req, res) => {
//   res.json({
//     status: "ok",
//     version: "1.0.0",
//   });
// });

// app.listen(PORT, () => {
//   console.log(
//     `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
//   );
// });

//!1111111111111111111

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
