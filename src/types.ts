import { Request, Response } from "express";

// Define the TelexSettingType enum
export enum TelexSettingType {
  NUMBER = "number",
  CHECKBOX = "checkbox",
  DROPDOWN = "dropdown",
}

export interface TelexSetting {
  label: string;
  type: TelexSettingType;
  required: boolean;
  default: string | number | boolean;
  description?: string;
  options?: string[];
}

// Define the TelexModifierRequest interface
export interface TelexModifierRequest {
  message: string;
  settings?: TelexSetting[];
  metadata?: {
    user_id?: string;
    timestamp?: string;
    client_version?: string;
    environment?: string;
    request_id?: string;
  };
}

// Define the TelexRequest interface
export interface TelexRequest extends Request {
  body: TelexModifierRequest;
}

export interface TelexMetadata {
  processed: boolean;
  sentiment_score: number;
  processing_time: number;
  timestamp: string;
  sensitivity_level: string;
  detailed_sentiment?: ComprehendSentimentResponse;
}

export interface TelexModifierResponse {
  message: string;
  metadata: TelexMetadata;
}

export interface TelexHealthResponse {
  status: string;
  version: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  timestamp: string;
  aws_status?: string;
}

export enum TelexErrorCode {
  INVALID_MESSAGE = "INVALID_MESSAGE",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  API_ERROR = "API_ERROR",
  AWS_ERROR = "AWS_ERROR",
}

export interface TelexErrorResponse {
  error: string;
  code: TelexErrorCode;
  details: string;
  timestamp: string;
}

export type TelexResponse = Response<
  TelexModifierResponse | TelexErrorResponse | TelexHealthResponse
>;

// AWS Comprehend specific types
export interface ComprehendSentimentScores {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

export interface ComprehendSentimentResponse {
  sentiment: string;
  scores: ComprehendSentimentScores;
}
