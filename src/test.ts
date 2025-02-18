import axios, { AxiosError } from "axios";
import { TelexModifierRequest } from "./types";

const BASE_URL = "http://localhost:3000";

const TEST_MESSAGES = [
  {
    description: "Positive message",
    payload: {
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
];

async function testResponseTime(payload: TelexModifierRequest) {
  const start = Date.now();
  await axios.post(`${BASE_URL}/target_url`, payload);
  return Date.now() - start;
}

async function runTests() {
  console.log("🧪 Starting Telex Integration Tests\n");

  for (const test of TEST_MESSAGES) {
    try {
      console.log(`Testing: ${test.description}`);

      const response = await axios.post(`${BASE_URL}/target_url`, test.payload);
      console.log("Response:", response.data);

      if (!response.data.hasOwnProperty("message")) {
        throw new Error("Invalid response format: missing message property");
      }

      const responseTime = await testResponseTime(test.payload);
      console.log(`Response time: ${responseTime}ms`);

      if (responseTime > 1000) {
        console.warn("⚠️ Warning: Response time exceeds 1 second limit");
      }

      console.log("✅ Test passed\n");
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Test failed:", error.message, "\n");
      } else {
        console.error("❌ Test failed with unknown error\n");
      }
    }
  }

  try {
    console.log("Testing error handling (missing message)");
    const response = await axios.post(`${BASE_URL}/target_url`, {
      settings: [],
    });
    console.log("Response:", response.data);
    console.log("✅ Error handling test passed\n");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Response:", error.response?.data);
      console.log("✅ Error handling test passed\n");
    } else {
      console.log("❌ Unexpected error occurred\n");
    }
  }
}

runTests().catch(console.error);
