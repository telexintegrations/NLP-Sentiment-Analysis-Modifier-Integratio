import {
  ComprehendClient,
  DetectSentimentCommand,
} from "@aws-sdk/client-comprehend";
import { ComprehendSentimentResponse } from "./types";
import dotenv from "dotenv";

dotenv.config();

// Initialize AWS Comprehend client
const comprehendClient = new ComprehendClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const analyzeSentiment = async (text: string): Promise<number> => {
  try {
    const command = new DetectSentimentCommand({
      Text: text,
      LanguageCode: "en",
    });

    const response = await comprehendClient.send(command);

    // Convert AWS sentiment scores to a normalized score between -1 and 1
    const sentimentMap: { [key: string]: number } = {
      POSITIVE: 1,
      NEUTRAL: 0,
      NEGATIVE: -1,
      MIXED: 0,
    };

    // Get base sentiment
    const baseSentiment = sentimentMap[response.Sentiment || "NEUTRAL"];

    // Use SentimentScore to get more precise sentiment
    const sentimentScore = response.SentimentScore || {
      Positive: 0,
      Negative: 0,
      Neutral: 0,
      Mixed: 0,
    };

    // Calculate weighted score
    let score = 0;
    if (baseSentiment > 0) {
      score = sentimentScore.Positive || 0;
    } else if (baseSentiment < 0) {
      score = -(sentimentScore.Negative || 0);
    } else {
      score =
        ((sentimentScore.Positive || 0) - (sentimentScore.Negative || 0)) / 2;
    }

    return score;
  } catch (error) {
    console.error("Error analyzing sentiment with AWS Comprehend:", error);
    throw new Error("Failed to analyze sentiment");
  }
};

// Additional utility for detailed sentiment analysis
export const getDetailedSentiment = async (
  text: string
): Promise<ComprehendSentimentResponse> => {
  try {
    const command = new DetectSentimentCommand({
      Text: text,
      LanguageCode: "en",
    });

    const response = await comprehendClient.send(command);

    return {
      sentiment: response.Sentiment || "NEUTRAL",
      scores: {
        positive: response.SentimentScore?.Positive || 0,
        negative: response.SentimentScore?.Negative || 0,
        neutral: response.SentimentScore?.Neutral || 0,
        mixed: response.SentimentScore?.Mixed || 0,
      },
    };
  } catch (error) {
    console.error(
      "Error getting detailed sentiment with AWS Comprehend:",
      error
    );
    throw new Error("Failed to get detailed sentiment analysis");
  }
};
