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

// // types.ts
// import { Request, Response } from "express";

// // Enum for setting types to ensure type safety
// export enum TelexSettingType {
//   NUMBER = "number",
//   STRING = "string",
//   BOOLEAN = "boolean",
// }

// // Enum for error codes
// export enum TelexErrorCode {
//   INVALID_MESSAGE = "INVALID_MESSAGE",
//   INVALID_CHANNEL = "INVALID_CHANNEL",
//   INVALID_TARGET_URL = "INVALID_TARGET_URL",
//   PROCESSING_ERROR = "PROCESSING_ERROR",
//   TIMEOUT_ERROR = "TIMEOUT_ERROR",
//   API_ERROR = "API_ERROR",
// }

// // Interface for individual setting with stronger typing
// export interface TelexSetting {
//   label: string;
//   type: TelexSettingType;
//   default: string | number | boolean;
//   required: boolean;
//   description?: string;
//   validation?: {
//     min?: number;
//     max?: number;
//     pattern?: RegExp;
//     options?: string[];
//   };
// }

// // Metadata interface for better type safety
// export interface TelexMetadata {
//   user_id?: string;
//   timestamp?: string;
//   client_version?: string;
//   environment?: string;
//   request_id?: string;
// }

// // Main request interface with improved structure
// export interface TelexModifierRequest {
//   channel_id: string;
//   message: string;
//   target_url: string;
//   settings: TelexSetting[];
//   metadata?: TelexMetadata;
// }

// // Response metadata interface
// export interface TelexResponseMetadata {
//   processed: boolean;
//   sentiment_score?: number;
//   processing_time: number;
//   channel_id: string;
//   target_url: string;
//   timestamp: string;
// }

// // Response interface with improved typing
// export interface TelexModifierResponse {
//   message: string;
//   metadata: TelexResponseMetadata;
// }

// // Enhanced error response interface
// export interface TelexErrorResponse {
//   error: string;
//   code: TelexErrorCode;
//   details: string;
//   timestamp: string;
//   request_id?: string;
// }

// // Settings validator interface with added functionality
// export interface TelexSettingsValidator {
//   validateSetting: (setting: TelexSetting) => boolean;
//   getDefaultSettings: () => TelexSetting[];
//   validateSettings: (settings: TelexSetting[]) => boolean;
// }

// // Health check response interface
// export interface TelexHealthResponse {
//   status: "ok" | "degraded" | "error";
//   version: string;
//   uptime: number;
//   memory: NodeJS.MemoryUsage;
//   timestamp: string;
// }

// // Type for requests with proper generic types
// export type TelexRequest = Request<
//   {},
//   TelexModifierResponse | TelexErrorResponse,
//   TelexModifierRequest
// >;

// // Type for responses with proper generic types
// export type TelexResponse = Response<
//   TelexModifierResponse | TelexErrorResponse | TelexHealthResponse
// >;

// // Utility type for settings with default values
// export const DEFAULT_SETTINGS: TelexSetting[] = [
//   {
//     label: "Toxicity Threshold",
//     type: TelexSettingType.NUMBER,
//     default: -0.5,
//     required: true,
//     description: "Threshold for marking messages as potentially harmful",
//     validation: {
//       min: -1,
//       max: 1,
//     },
//   },
// ];

// // Utility functions for type checking
// export const isValidUrl = (url: string): boolean => {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// };

// export const isValidSetting = (setting: unknown): setting is TelexSetting => {
//   const s = setting as TelexSetting;
//   return (
//     typeof s === "object" &&
//     s !== null &&
//     typeof s.label === "string" &&
//     Object.values(TelexSettingType).includes(s.type) &&
//     typeof s.required === "boolean"
//   );
// };

// export const isValidRequest = (req: unknown): req is TelexModifierRequest => {
//   const r = req as TelexModifierRequest;
//   return (
//     typeof r === "object" &&
//     r !== null &&
//     typeof r.channel_id === "string" &&
//     typeof r.message === "string" &&
//     typeof r.target_url === "string" &&
//     isValidUrl(r.target_url) &&
//     Array.isArray(r.settings) &&
//     r.settings.every(isValidSetting)
//   );
// };

//!000000000000000000000000000000000000000000000000000000
// // types.ts
// import { Request, Response } from "express";

// // Enum for setting types to ensure type safety
// export enum TelexSettingType {
//   NUMBER = "number",
//   STRING = "string",
//   BOOLEAN = "boolean",
// }

// // Enum for error codes
// export enum TelexErrorCode {
//   INVALID_MESSAGE = "INVALID_MESSAGE",
//   INVALID_CHANNEL = "INVALID_CHANNEL",
//   INVALID_TARGET_URL = "INVALID_TARGET_URL",
//   PROCESSING_ERROR = "PROCESSING_ERROR",
//   TIMEOUT_ERROR = "TIMEOUT_ERROR",
//   API_ERROR = "API_ERROR",
// }

// // Interface for individual setting with stronger typing
// export interface TelexSetting {
//   label: string;
//   type: TelexSettingType;
//   default: string | number | boolean;
//   required: boolean;
//   description?: string;
//   validation?: {
//     min?: number;
//     max?: number;
//     pattern?: RegExp;
//     options?: string[];
//   };
// }

// // Metadata interface for better type safety
// export interface TelexMetadata {
//   user_id?: string;
//   timestamp?: string;
//   client_version?: string;
//   environment?: string;
//   request_id?: string;
// }

// // Main request interface with improved structure
// export interface TelexModifierRequest {
//   channel_id: string;
//   message: string;
//   target_url: string; // Added target_url field
//   settings: TelexSetting[];
//   metadata?: TelexMetadata;
// }

// // Response metadata interface
// export interface TelexResponseMetadata {
//   processed: boolean;
//   sentiment_score?: number;
//   processing_time: number;
//   channel_id: string;
//   target_url: string; // Added target_url field
//   timestamp: string;
// }

// // Response interface with improved typing
// export interface TelexModifierResponse {
//   message: string;
//   metadata: TelexResponseMetadata;
// }

// // Enhanced error response interface
// export interface TelexErrorResponse {
//   error: string;
//   code: TelexErrorCode;
//   details: string;
//   timestamp: string;
//   request_id?: string;
// }

// // Settings validator interface with added functionality
// export interface TelexSettingsValidator {
//   validateSetting: (setting: TelexSetting) => boolean;
//   getDefaultSettings: () => TelexSetting[];
//   validateSettings: (settings: TelexSetting[]) => boolean;
// }

// // Health check response interface
// export interface TelexHealthResponse {
//   status: "ok" | "degraded" | "error";
//   version: string;
//   uptime: number;
//   memory: NodeJS.MemoryUsage;
//   timestamp: string;
// }

// // Type for requests with proper generic types
// export type TelexRequest = Request<
//   {},
//   TelexModifierResponse | TelexErrorResponse,
//   TelexModifierRequest
// >;

// // Type for responses with proper generic types
// export type TelexResponse = Response<
//   TelexModifierResponse | TelexErrorResponse | TelexHealthResponse
// >;

// // Utility type for settings with default values
// export const DEFAULT_SETTINGS: TelexSetting[] = [
//   {
//     label: "Toxicity Threshold",
//     type: TelexSettingType.NUMBER,
//     default: -0.5,
//     required: true,
//     description: "Threshold for marking messages as potentially harmful",
//     validation: {
//       min: -1,
//       max: 1,
//     },
//   },
// ];

// // Utility functions for type checking
// export const isValidUrl = (url: string): boolean => {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// };

// export const isValidSetting = (setting: unknown): setting is TelexSetting => {
//   const s = setting as TelexSetting;
//   return (
//     typeof s === "object" &&
//     s !== null &&
//     typeof s.label === "string" &&
//     Object.values(TelexSettingType).includes(s.type) &&
//     typeof s.required === "boolean"
//   );
// };

// export const isValidRequest = (req: unknown): req is TelexModifierRequest => {
//   const r = req as TelexModifierRequest;
//   return (
//     typeof r === "object" &&
//     r !== null &&
//     typeof r.channel_id === "string" &&
//     typeof r.message === "string" &&
//     typeof r.target_url === "string" &&
//     isValidUrl(r.target_url) &&
//     Array.isArray(r.settings) &&
//     r.settings.every(isValidSetting)
//   );
// };

//!11111111111111111111111111111111111111111111111
// import { Request, Response } from "express";

// // Enum for setting types to ensure type safety
// export enum TelexSettingType {
//   NUMBER = "number",
//   STRING = "string",
//   BOOLEAN = "boolean",
// }

// // Interface for individual setting
// export interface TelexSetting {
//   label: string;
//   type: TelexSettingType;
//   default: string | number | boolean;
//   required: boolean;
//   description?: string; // Optional description for the setting
//   min?: number; // Optional min value for number settings
//   max?: number; // Optional max value for number settings
// }

// // Main request interface
// export interface TelexModifierRequest {
//   channel_id: string;
//   message: string;
//   settings: TelexSetting[];
//   metadata?: {
//     // Optional metadata field
//     user_id?: string;
//     timestamp?: string;
//     client_version?: string;
//   };
// }

// // Response interface with optional fields for more detailed responses
// export interface TelexModifierResponse {
//   message: string;
//   metadata?: {
//     processed: boolean;
//     sentiment_score?: number;
//     processing_time?: number;
//   };
// }

// // Error response interface
// export interface TelexErrorResponse {
//   error: string;
//   code: string;
//   details?: any;
// }

// // Type for successful responses
// export type TelexRequest = Request<
//   {},
//   TelexModifierResponse | TelexErrorResponse,
//   TelexModifierRequest
// >;
// export type TelexResponse = Response<
//   TelexModifierResponse | TelexErrorResponse
// >;

// // Utility type for settings validation
// export interface TelexSettingsValidator {
//   validateSetting: (setting: TelexSetting) => boolean;
//   getDefaultSettings: () => TelexSetting[];
// }

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
