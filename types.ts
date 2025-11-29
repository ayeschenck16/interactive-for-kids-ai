export interface MagicImage {
  id: string;
  data: string; // Base64 data
  prompt: string;
  timestamp: number;
}

export interface GenerationResult {
  image?: string;
  text?: string;
  error?: string;
}
