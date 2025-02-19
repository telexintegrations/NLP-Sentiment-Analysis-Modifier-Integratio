import { Request, Response } from "express";

// Enum for setting types to ensure type safety
export enum TelexSettingType {
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "boolean",
}

// Interface for individual setting
export interface TelexSetting {
  label: string;
  type: TelexSettingType;
  default: string | number | boolean;
  required: boolean;
  description?: string; // Optional description for the setting
  min?: number; // Optional min value for number settings
  max?: number; // Optional max value for number settings
}

// Main request interface
export interface TelexModifierRequest {
  channel_id: string;
  message: string;
  settings: TelexSetting[];
  metadata?: {
    // Optional metadata field
    user_id?: string;
    timestamp?: string;
    client_version?: string;
  };
}

// Response interface with optional fields for more detailed responses
export interface TelexModifierResponse {
  message: string;
  metadata?: {
    processed: boolean;
    sentiment_score?: number;
    processing_time?: number;
  };
}

// Error response interface
export interface TelexErrorResponse {
  error: string;
  code: string;
  details?: any;
}

// Type for successful responses
export type TelexRequest = Request<
  {},
  TelexModifierResponse | TelexErrorResponse,
  TelexModifierRequest
>;
export type TelexResponse = Response<
  TelexModifierResponse | TelexErrorResponse
>;

// Utility type for settings validation
export interface TelexSettingsValidator {
  validateSetting: (setting: TelexSetting) => boolean;
  getDefaultSettings: () => TelexSetting[];
}

// import { Request, Response } from "express";

// export interface TelexModifierRequest {
//   message: string;
//   settings: {
//     label: string;
//     type: string;
//     default: string | number;
//     required: boolean;
//   }[];
// }

// export interface TelexModifierResponse {
//   message: string;
// }

// export type TelexRequest = Request<
//   {},
//   TelexModifierResponse,
//   TelexModifierRequest
// >;
// export type TelexResponse = Response<TelexModifierResponse>;
