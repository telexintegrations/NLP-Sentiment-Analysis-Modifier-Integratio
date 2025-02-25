import axios, { AxiosError } from "axios";
import {
  TelexModifierRequest,
  TelexSettingType,
  TelexModifierResponse,
  TelexErrorResponse,
} from "./types";

const BASE_URL = "http://localhost:3000";
const TEST_TIMEOUT = 1000; // 1 second timeout

interface TestCase {
  description: string;
  payload: TelexModifierRequest;
  expectedStatus?: number;
}

const TEST_MESSAGES: TestCase[] = [
  {
    description: "Positive message",
    payload: {
      message: "I absolutely love this product! It's amazing!",
      settings: [
        {
          label: "Toxicity Threshold",
          type: TelexSettingType.NUMBER,
          default: -0.5,
          required: true,
        },
      ],
      metadata: {
        user_id: "test-user",
        timestamp: new Date().toISOString(),
        client_version: "1.0.0",
        environment: "test",
        request_id: "test-" + Date.now(),
      },
    },
    expectedStatus: 200,
  },
  {
    description: "Negative message",
    payload: {
      message: "This is terrible! I hate everything about it!",
      settings: [
        {
          label: "Toxicity Threshold",
          type: TelexSettingType.NUMBER,
          default: -0.5,
          required: true,
        },
      ],
      metadata: {
        user_id: "test-user",
        timestamp: new Date().toISOString(),
        client_version: "1.0.0",
        environment: "test",
        request_id: "test-" + Date.now(),
      },
    },
    expectedStatus: 200,
  },
  {
    description: "Neutral message",
    payload: {
      message: "The weather is cloudy today.",
      settings: [
        {
          label: "Toxicity Threshold",
          type: TelexSettingType.NUMBER,
          default: -0.5,
          required: true,
        },
      ],
    },
  },
  {
    description: "Extreme negative message",
    payload: {
      message: "This is absolutely horrible! Worst experience of my life!",
      settings: [
        {
          label: "Toxicity Threshold",
          type: TelexSettingType.NUMBER,
          default: -0.5,
          required: true,
        },
      ],
    },
  },
];

// Update error test cases
const ERROR_TEST_CASES: TestCase[] = [
  {
    description: "Missing message",
    payload: {
      message: "",
      settings: [],
    },
    expectedStatus: 400,
  },
];

async function runTests() {
  console.log("Starting tests...\n");
  let passedTests = 0;
  let failedTests = 0;

  // Test health endpoint
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check passed:", healthResponse.data);
  } catch (error) {
    console.error("❌ Health check failed:", error);
  }

  // Run normal test cases
  for (const testCase of [...TEST_MESSAGES, ...ERROR_TEST_CASES]) {
    try {
      console.log(`\nRunning test: ${testCase.description}`);
      const response = await axios.post(
        `${BASE_URL}/format-message`,
        testCase.payload,
        {
          timeout: TEST_TIMEOUT,
          validateStatus: null,
        }
      );

      if (
        testCase.expectedStatus &&
        response.status !== testCase.expectedStatus
      ) {
        console.error(`❌ Test failed: ${testCase.description}`);
        console.error(
          `Expected status ${testCase.expectedStatus}, got ${response.status}`
        );
        failedTests++;
        continue;
      }

      console.log("Status:", response.status);
      console.log("Response:", JSON.stringify(response.data, null, 2));
      passedTests++;
    } catch (error) {
      console.error(`❌ Test failed: ${testCase.description}`);
      if (error instanceof AxiosError) {
        console.error("Error:", error.response?.data || error.message);
      } else {
        console.error("Error:", error);
      }
      failedTests++;
    }
  }

  console.log("\nTest Summary:");
  console.log(`Total tests: ${TEST_MESSAGES.length + ERROR_TEST_CASES.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
}

// Run the tests
runTests().catch(console.error);
