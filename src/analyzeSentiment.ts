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
// // analyzeSentiment.ts
// import { OpenAI } from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const SENTIMENT_TIMEOUT = 5000; // 5 second timeout for sentiment analysis
// const DEFAULT_SENTIMENT = 0;

// /**
//  * Analyze sentiment using OpenAI API.
//  * Returns a score between -1 (very negative) to 1 (very positive).
//  * @throws {Error} If the API key is not configured
//  */
// export async function analyzeSentiment(text: string): Promise<number> {
//   if (!process.env.OPENAI_API_KEY) {
//     throw new Error("OpenAI API key not configured");
//   }

//   // Input validation
//   if (!text || typeof text !== "string") {
//     console.warn("Invalid input text:", text);
//     return DEFAULT_SENTIMENT;
//   }

//   try {
//     const response = (await Promise.race([
//       openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a sentiment analysis assistant. Respond with a single number between -1 (very negative) to 1 (very positive).",
//           },
//           {
//             role: "user",
//             content: `Analyze the sentiment of this message: "${text}"`,
//           },
//         ],
//         max_tokens: 10,
//         temperature: 0.3,
//       }),
//       new Promise((_, reject) =>
//         setTimeout(
//           () => reject(new Error("Sentiment analysis timeout")),
//           SENTIMENT_TIMEOUT
//         )
//       ),
//     ])) as OpenAI.Chat.Completions.ChatCompletion; // Explicitly type the response

//     const sentimentText =
//       response.choices[0]?.message.content?.trim() ?? String(DEFAULT_SENTIMENT);
//     const sentimentScore = parseFloat(sentimentText);

//     if (isNaN(sentimentScore) || sentimentScore < -1 || sentimentScore > 1) {
//       console.warn("Invalid sentiment score received:", sentimentText);
//       return DEFAULT_SENTIMENT;
//     }

//     return sentimentScore;
//   } catch (error) {
//     console.error("Sentiment analysis error:", error);
//     if (error instanceof Error) {
//       console.error("Error details:", {
//         message: error.message,
//         name: error.name,
//         stack: error.stack,
//       });
//     }
//     return DEFAULT_SENTIMENT;
//   }
// }

// // analyzeSentiment.ts
// import { OpenAI } from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// /**
//  * Analyze sentiment using OpenAI API.
//  * Returns a score between -1 (very negative) to 1 (very positive).
//  */
// export async function analyzeSentiment(text: string): Promise<number> {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a sentiment analysis assistant. Respond with a single number between -1 (very negative) to 1 (very positive).",
//         },
//         {
//           role: "user",
//           content: `Analyze the sentiment of this message: "${text}"`,
//         },
//       ],
//       max_tokens: 10,
//       temperature: 0.3, // Lower temperature for more consistent results
//     });

//     const sentimentText = response.choices[0]?.message.content?.trim() ?? "0";
//     const sentimentScore = parseFloat(sentimentText);

//     // Validate the sentiment score
//     if (isNaN(sentimentScore) || sentimentScore < -1 || sentimentScore > 1) {
//       console.warn("Invalid sentiment score received:", sentimentText);
//       return 0; // Return neutral sentiment for invalid scores
//     }

//     return sentimentScore;
//   } catch (error) {
//     console.error("OpenAI API Error:", error);
//     // Log more details about the error for debugging
//     if (error instanceof Error) {
//       console.error("Error details:", {
//         message: error.message,
//         name: error.name,
//         stack: error.stack,
//       });
//     }
//     return 0; // Default to neutral sentiment on error
//   }
// }
