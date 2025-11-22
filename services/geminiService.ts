import { GoogleGenAI } from "@google/genai";
import { CustomizationState } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client
// Note: We are using gemini-2.5-flash-image for good speed/quality balance on image editing tasks.
// gemini-3-pro-image-preview is better but requires specific key selection flows which we simplify here for the demo.
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateTryOn = async (
  imageBase64: string,
  options: CustomizationState
): Promise<string> => {
  if (!ai) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }

  // Clean the base64 string (remove data:image/jpeg;base64, prefix if present)
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const prompt = `
    The input image shows a person. 
    Task: Edit the image to dress the person in a ${options.dressType} made of ${options.color} Myco Leather (mushroom mycelium leather).
    Texture details: The material should look organic, slightly textured, high-quality, and sustainable.
    ${options.accessory !== 'None' ? `Add a matching ${options.accessory} made of the same material.` : ''}
    Preserve the person's face, identity, body pose, and the background exactly as they are. 
    The lighting should be cinematic and realistic.
    Output ONLY the transformed image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
        ],
      },
    });

    // Check for image in the response parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
