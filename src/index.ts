import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ComprehendClient } from "@aws-sdk/client-comprehend";
import { analyzeSentiment, getDetailedSentiment } from "./analyzeSentiment";
import { telexConfig } from "./telexConfiguration/telexJson";
import {
  TelexRequest,
  TelexResponse,
  TelexErrorCode,
  TelexModifierResponse,
  TelexErrorResponse,
  TelexHealthResponse,
} from "./types";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize AWS Client for health checks
const comprehendClient = new ComprehendClient({
  region: process.env.AWS_REGION || "us-east-1",
});

app.post(
  "/format-message",
  async (req: TelexRequest, res: TelexResponse): Promise<void> => {
    const startTime = Date.now();

    try {
      const { message, settings } = req.body;

      // Validate message is provided
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

      // Get both sentiment score and detailed analysis
      const [sentimentScore, detailedSentiment] = await Promise.all([
        analyzeSentiment(message),
        getDetailedSentiment(message),
      ]);

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
          timestamp: new Date().toISOString(),
          sensitivity_level: sentimentScore.toString(),
          detailed_sentiment: detailedSentiment,
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorResponse: TelexErrorResponse = {
        error: "Processing failed",
        code: TelexErrorCode.AWS_ERROR,
        details:
          error instanceof Error
            ? error.message
            : "AWS Comprehend error occurred",
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(errorResponse);
    }
  }
);

app.get("/", (req, res) => {
  res.send("Telex Sentiment Analyzer API is running!");
});

// Config endpoint
app.get("/integration.json", (_req, res) => {
  try {
    res.json(telexConfig);
  } catch (error) {
    const errorResponse: TelexErrorResponse = {
      error: "Failed to retrieve configuration",
      code: TelexErrorCode.API_ERROR,
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(errorResponse);
  }
});

// Enhanced health check endpoint with AWS status
app.get("/health", async (_req, res: TelexResponse) => {
  try {
    // Test AWS connectivity
    await comprehendClient.config.credentials();

    const healthResponse: TelexHealthResponse = {
      status: "ok",
      version: "1.0.0",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      aws_status: "connected",
    };
    res.json(healthResponse);
  } catch (error) {
    const healthResponse: TelexHealthResponse = {
      status: "degraded",
      version: "1.0.0",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      aws_status: "disconnected",
    };
    res.status(503).json(healthResponse);
  }
});

app.listen(PORT, () => {
  console.log(
    `✅ Telex Sentiment Modifier Integration running on port ${PORT}`
  );
});
