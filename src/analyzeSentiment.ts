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

// import {
//   TelexModifierRequest,
//   TelexModifierResponse,
//   TelexErrorResponse,
//   TelexErrorCode,
// } from "./types";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure this is set in your environment variables
// const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// if (!OPENAI_API_KEY) {
//   throw new Error(
//     "OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable."
//   );
// }

// /**
//  * Analyzes the sentiment of a given message using OpenAI's GPT API.
//  * @param message - The message to analyze.
//  * @returns A sentiment score between -1 (negative) and 1 (positive).
//  */
// export const analyzeSentiment = async (message: string): Promise<number> => {
//   try {
//     const response = await axios.post(
//       OPENAI_API_URL,
//       {
//         model: "gpt-3.5-turbo", // or "gpt-4"
//         messages: [
//           {
//             role: "system",
//             content:
//               "Analyze the sentiment of the following message. Respond with a JSON object containing a 'sentiment_score' field, where the value is a number between -1 (negative) and 1 (positive).",
//           },
//           {
//             role: "user",
//             content: message,
//           },
//         ],
//         response_format: { type: "json_object" }, // Ensure the response is in JSON format
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Parse the response to extract the sentiment score
//     const sentimentResponse = JSON.parse(
//       response.data.choices[0].message.content
//     );
//     const sentimentScore = sentimentResponse.sentiment_score;

//     if (
//       typeof sentimentScore !== "number" ||
//       sentimentScore < -1 ||
//       sentimentScore > 1
//     ) {
//       throw new Error("Invalid sentiment score returned from OpenAI API.");
//     }

//     return sentimentScore;
//   } catch (error) {
//     console.error("Error analyzing sentiment with OpenAI API:", error);
//     throw new Error("Failed to analyze sentiment.");
//   }
// };

// /**
//  * Modifies the message based on sentiment analysis.
//  * @param request - The TelexModifierRequest object.
//  * @returns A TelexModifierResponse or TelexErrorResponse.
//  */
// export const modifyMessage = async (
//   request: TelexModifierRequest
// ): Promise<TelexModifierResponse | TelexErrorResponse> => {
//   try {
//     const sentimentScore = await analyzeSentiment(request.message);

//     // Modify the message based on sentiment (example logic)
//     let modifiedMessage = request.message;
//     if (sentimentScore < -0.5) {
//       modifiedMessage = `[Negative Sentiment Detected] ${request.message}`;
//     } else if (sentimentScore > 0.5) {
//       modifiedMessage = `[Positive Sentiment Detected] ${request.message}`;
//     }

//     return {
//       message: modifiedMessage,
//       metadata: {
//         processed: true,
//         sentiment_score: sentimentScore,
//         processing_time: Date.now(),
//         channel_id: request.channel_id,
//         target_url: request.target_url,
//         timestamp: new Date().toISOString(),
//       },
//     };
//   } catch (error) {
//     console.error("Error modifying message:", error);
//     return {
//       error: "Failed to modify message.",
//       code: TelexErrorCode.PROCESSING_ERROR,
//       details: error instanceof Error ? error.message : "Unknown error",
//       timestamp: new Date().toISOString(),
//     };
//   }
// };
