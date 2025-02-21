import { Request, Response } from "express";
import { DEFAULT_SETTINGS } from "./config";

export interface TelexConfig {
  data: {
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
    settings: TelexSetting[];
    target_url: string;
  };
}

export enum TelexSettingType {
  NUMBER = "number",
  CHECKBOX = "checkbox",
  DROPDOWN = "dropdown",
}

export enum TelexErrorCode {
  INVALID_MESSAGE = "INVALID_MESSAGE",
  INVALID_CHANNEL = "INVALID_CHANNEL",
  INVALID_TARGET_URL = "INVALID_TARGET_URL",
  PROCESSING_ERROR = "PROCESSING_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  API_ERROR = "API_ERROR",
}

export interface TelexSetting {
  label: string;
  type: TelexSettingType;
  default: string | number | boolean;
  required: boolean;
  description?: string;
  options?: string[];
}

export interface TelexMetadata {
  user_id?: string;
  timestamp?: string;
  client_version?: string;
  environment?: string;
  request_id?: string;
}

export interface TelexModifierRequest {
  channel_id: string;
  message: string;
  target_url: string;
  settings?: TelexSetting[];
  metadata?: TelexMetadata;
}

export interface TelexResponseMetadata {
  processed: boolean;
  sentiment_score?: number;
  processing_time: number;
  channel_id: string;
  target_url: string;
  timestamp: string;
  sensitivity_level?: string;
}

export interface TelexModifierResponse {
  message: string;
  metadata: TelexResponseMetadata;
}

export interface TelexErrorResponse {
  error: string;
  code: TelexErrorCode;
  details: string;
  timestamp: string;
  request_id?: string;
}

export interface TelexHealthResponse {
  status: "ok" | "degraded" | "error";
  version: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  timestamp: string;
}

export type TelexRequest = Request<
  {},
  TelexModifierResponse | TelexErrorResponse,
  TelexModifierRequest
>;

export type TelexResponse = Response<
  TelexModifierResponse | TelexErrorResponse | TelexHealthResponse
>;
