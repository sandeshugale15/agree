import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MarketInsight, PlantAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const analyzePlantImage = async (
  base64Image: string, 
  mimeType: string
): Promise<PlantAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: {
        parts: [
          {
            text: `You are an expert plant pathologist. Analyze this image of a plant. 
            Identify the plant species.
            Diagnose any diseases, pests, or nutrient deficiencies visible.
            If healthy, state that it is healthy.
            Provide a confidence level (High/Medium/Low).
            Recommend organic and chemical treatments if applicable.
            
            Format the response as JSON with the following keys:
            - plantName: string
            - diagnosis: string (the name of the disease/issue)
            - confidence: string
            - description: string (detailed observation)
            - treatment: string (step-by-step advice)
            
            Do not include markdown code blocks (like \`\`\`json), just the raw JSON string.`
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const json = JSON.parse(text);

    return {
      diagnosis: json.diagnosis || "Unknown",
      confidence: json.confidence || "Low",
      treatment: json.treatment || "No treatment recommended.",
      rawText: json.description || "Could not analyze the image."
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

export const getChatStream = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (text: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_FLASH,
      config: {
        systemInstruction: "You are AgriSmart, a helpful and knowledgeable agricultural consultant. You help farmers and gardeners with planting schedules, soil health, pest control, and general farming advice. Keep answers concise and practical."
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export const getMarketInsights = async (query: string): Promise<MarketInsight> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Provide a summary of the latest agricultural market trends, specifically regarding: ${query}. Focus on prices, supply chain issues, and forecasts.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources: { uri: string; title: string }[] = [];
    
    // Extract grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title
          });
        }
      });
    }

    return {
      content: response.text || "No insights found.",
      sources: sources
    };

  } catch (error) {
    console.error("Market insights error:", error);
    throw new Error("Failed to fetch market insights.");
  }
};
