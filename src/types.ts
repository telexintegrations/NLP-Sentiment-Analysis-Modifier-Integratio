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
