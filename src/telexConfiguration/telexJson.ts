// Define the config interface
export interface TelexConfigData {
  date: {
    created_at: string;
    updated_at: string;
  };
  descriptions: {
    app_name: string;
    app_description: string;
    app_logo: string;
    app_url: string;
    background_color: string;
  };
  integration_category: string;
  integration_type: string;
  is_active: boolean;
  settings: Array<{
    label: string;
    type: string;
    required: boolean;
    default: string;
    description: string;
    options?: string[];
  }>;
  target_url: string;
}

export interface TelexConfig {
  data: TelexConfigData;
}

export const telexConfig: TelexConfig = {
  data: {
    date: {
      created_at: "2024-02-17",
      updated_at: "2024-02-21",
    },
    descriptions: {
      app_name: "Message Sentiment Analyzer",
      app_description:
        "Analyzes message sentiment using advanced NLP and flags potentially harmful content.",
      app_logo: "https://i.ibb.co/4ZpTNTv3/Telex-Sentiment-Analyzer.png",
      app_url: "https://telex-sentiment-analysis-modifier.onrender.com",
      background_color: "#4A90E2",
    },
    integration_category: "Communication & Collaboration",
    integration_type: "modifier",
    is_active: true,
    settings: [
      {
        label: "Toxicity Threshold",
        type: "number",
        required: true,
        default: "-0.5",
        description: "Threshold for marking messages as potentially harmful",
      },
      {
        label: "Add Warning Prefix",
        type: "checkbox",
        required: true,
        default: "Yes",
        description: "Prepend warning symbol to toxic messages",
      },
      {
        label: "Sensitivity Level",
        type: "dropdown",
        required: true,
        default: "Medium",
        options: ["Low", "Medium", "High"],
        description: "Adjust overall sensitivity of sentiment detection",
      },
    ],
    target_url:
      "https://ping.telex.im/v1/webhooks/01951d72-fb32-74b0-9c9f-ed1347b1513b",
  },
};
