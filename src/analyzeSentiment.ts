import {
  TelexModifierRequest,
  TelexModifierResponse,
  TelexErrorResponse,
  TelexErrorCode,
} from "./types";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure this is set in your environment variables
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

if (!OPENAI_API_KEY) {
  throw new Error(
    "OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable."
  );
}

/**
 * Analyzes the sentiment of a given message using OpenAI's GPT API.
 * @param message - The message to analyze.
 * @returns A sentiment score between -1 (negative) and 1 (positive).
 */
export const analyzeSentiment = async (message: string): Promise<number> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo", // or "gpt-4"
        messages: [
          {
            role: "system",
            content:
              "Analyze the sentiment of the following message. Respond with a JSON object containing a 'sentiment_score' field, where the value is a number between -1 (negative) and 1 (positive).",
          },
          {
            role: "user",
            content: message,
          },
        ],
        response_format: { type: "json_object" }, // Ensure the response is in JSON format
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse the response to extract the sentiment score
    const sentimentResponse = JSON.parse(
      response.data.choices[0].message.content
    );
    const sentimentScore = sentimentResponse.sentiment_score;

    if (
      typeof sentimentScore !== "number" ||
      sentimentScore < -1 ||
      sentimentScore > 1
    ) {
      throw new Error("Invalid sentiment score returned from OpenAI API.");
    }

    return sentimentScore;
  } catch (error) {
    console.error("Error analyzing sentiment with OpenAI API:", error);
    throw new Error("Failed to analyze sentiment.");
  }
};

/**
 * Modifies the message based on sentiment analysis.
 * @param request - The TelexModifierRequest object.
 * @returns A TelexModifierResponse or TelexErrorResponse.
 */
export const modifyMessage = async (
  request: TelexModifierRequest
): Promise<TelexModifierResponse | TelexErrorResponse> => {
  try {
    const sentimentScore = await analyzeSentiment(request.message);

    // Modify the message based on sentiment (example logic)
    let modifiedMessage = request.message;
    if (sentimentScore < -0.5) {
      modifiedMessage = `[Negative Sentiment Detected] ${request.message}`;
    } else if (sentimentScore > 0.5) {
      modifiedMessage = `[Positive Sentiment Detected] ${request.message}`;
    }

    return {
      message: modifiedMessage,
      metadata: {
        processed: true,
        sentiment_score: sentimentScore,
        processing_time: Date.now(),
        channel_id: request.channel_id,
        target_url: request.target_url,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error modifying message:", error);
    return {
      error: "Failed to modify message.",
      code: TelexErrorCode.PROCESSING_ERROR,
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};
