export const LANG = ["es", "en"] as const;
export type SupportedLangs = typeof LANG[number];

export const DEFAULT_LANG: SupportedLangs = "en"; 