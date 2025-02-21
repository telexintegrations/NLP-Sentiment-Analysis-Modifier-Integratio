import telexConfig from "./config/telexconfig.json";
import { TelexSetting, TelexConfig } from "./types";

export const getConfig = (): TelexConfig => {
  return telexConfig as TelexConfig;
};

export const DEFAULT_SETTINGS: TelexSetting[] = telexConfig.data
  .settings as TelexSetting[];
