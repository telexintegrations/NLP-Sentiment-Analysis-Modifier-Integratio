import { Request, Response } from "express";

export interface TelexModifierRequest {
  message: string;
  settings: {
    label: string;
    type: string;
    default: string | number;
    required: boolean;
  }[];
}

export interface TelexModifierResponse {
  message: string;
}

export type TelexRequest = Request<
  {},
  TelexModifierResponse,
  TelexModifierRequest
>;
export type TelexResponse = Response<TelexModifierResponse>;
