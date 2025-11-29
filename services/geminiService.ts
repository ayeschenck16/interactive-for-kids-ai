import { GoogleGenAI } from "@google/genai";
import { GenerationResult } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates an image based on a text prompt.
 */
export const generateMagicImage = async (prompt: string): Promise<GenerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        // Kids usually like square images for avatars/sharing
        imageConfig: {
          aspectRatio: "1:1", 
        }
      }
    });

    return parseResponse(response);
  } catch (error: any) {
    console.error("Generation error:", error);
    return { error: error.message || "Something went wrong! Try again." };
  }
};

/**
 * Edits an existing image based on a new prompt.
 */
export const editMagicImage = async (base64Image: string, prompt: string): Promise<GenerationResult> => {
  try {
    // Clean base64 string if it has the data url prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // Assuming PNG for simplicity/compatibility
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return parseResponse(response);
  } catch (error: any) {
    console.error("Editing error:", error);
    return { error: error.message || "Oops! Couldn't change the picture. Try a different magic spell!" };
  }
};

/**
 * Helper to parse the Gemini response to find the image part.
 */
const parseResponse = (response: any): GenerationResult => {
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    return { error: "No magic happened this time. Try again!" };
  }

  const parts = candidates[0].content.parts;
  let image: string | undefined;
  let text: string | undefined;

  for (const part of parts) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      // Construct a usable data URL
      image = `data:image/png;base64,${base64EncodeString}`;
    } else if (part.text) {
      text = part.text;
    }
  }

  if (!image && text) {
    // Sometimes the model refuses and just returns text (e.g. safety)
    return { error: text }; // Treat text-only response as an "error" or explanation for this specific app context
  }

  if (image) {
    return { image, text };
  }

  return { error: "The magic wand fizzled out. No image was created." };
};
