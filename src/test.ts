import axios, { AxiosError } from "axios";
import { TelexModifierRequest } from "./types";

const BASE_URL = "http://localhost:3000";

const TEST_MESSAGES = [
  {
    description: "Positive message",
    payload: {
      channel_id:
        "https://ping.telex.im/v1/webhooks/01951d72-fb32-74b0-9c9f-ed1347b1513b",
      message: "I absolutely love this product! It's amazing!",
      settings: [
        {
          label: "Toxicity Threshold",
          type: "number",
          default: -0.5,
          required: true,
        },
      ],
    },
  },
  {
    description: "Negative message",
    payload: {
      channel_id:
        "https://ping.telex.im/v1/webhooks/01951d72-fb32-74b0-9c9f-ed1347b1513b",
      message: "This is terrible! I hate everything about it!",
      settings: [
        {
          label: "Toxicity Threshold",
          type: "number",
          default: -0.5,
          required: true,
        },
      ],
    },
  },
  {
    description: "Neutral message",
    payload: {
      channel_id:
        "https://ping.telex.im/v1/webhooks/01951d72-fb32-74b0-9c9f-ed1347b1513b",
      message: "The weather is cloudy today.",
      settings: [
        {
          label: "Toxicity Threshold",
          type: "number",
          default: -0.5,
          required: true,
        },
      ],
    },
  },
  {
    description: "Missing channel_id",
    payload: {
      message: "Test message without channel_id",
      settings: [
        {
          label: "Toxicity Threshold",
          type: "number",
          default: -0.5,
          required: true,
        },
      ],
    },
  },
];

async function verifyServerRunning() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Server is running");
    console.log("Health check response:", response.data);
    console.log();
    return true;
  } catch (error) {
    console.error("❌ Server is not running. Please start the server first.\n");
    return false;
  }
}

async function runTests() {
  console.log("🧪 Starting Telex Integration Tests\n");

  // Verify server is running first
  if (!(await verifyServerRunning())) {
    return;
  }

  for (const test of TEST_MESSAGES) {
    try {
      console.log(`Testing: ${test.description}`);
      console.log("Sending request to:", `${BASE_URL}/format-message`); // Updated endpoint
      console.log("Payload:", JSON.stringify(test.payload, null, 2));

      const startTime = Date.now();
      const response = await axios.post(
        `${BASE_URL}/format-message`,
        test.payload
      );
      const responseTime = Date.now() - startTime;

      console.log("Response:", JSON.stringify(response.data, null, 2));

      // Validate response format
      if (!response.data.hasOwnProperty("message")) {
        throw new Error("Invalid response format: missing message property");
      }

      // Check for metadata if present
      if (response.data.metadata) {
        console.log("Metadata:", response.data.metadata);
      }

      console.log(`Response time: ${responseTime}ms`);

      if (responseTime > 1000) {
        console.warn("⚠️ Warning: Response time exceeds 1 second limit");
      }

      console.log("✅ Test passed\n");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("❌ Test failed:", error.message);
        console.error("Status:", error.response?.status);
        console.error(
          "Response:",
          JSON.stringify(error.response?.data, null, 2)
        );
        console.error("Request URL:", error.config?.url);
        console.error("Request method:", error.config?.method);
        console.error("\n");
      } else if (error instanceof Error) {
        console.error("❌ Test failed:", error.message, "\n");
      } else {
        console.error("❌ Test failed with unknown error\n");
      }
    }
  }
}

runTests().catch(console.error);
