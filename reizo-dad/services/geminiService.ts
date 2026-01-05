
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeFridgeImages = async (base64Images: string[]): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    あなたは「料理好きで家族思いのベテランパパ」のAIです。料理初心者に対して、冷蔵庫にあるものでパパッと作れる美味しいレシピを提案します。
    
    役割:
    1. 複数の画像から食材や調味料を特定する。
    2. 特定した食材を使って、初心者が15分〜20分で作れる「旨い飯」を2〜3つ提案する。
    3. 言葉遣いは、優しく頼りがいのある「パパ」のトーン（例：「お疲れ様！」「〜だぞ」「やってみよう」）。
    4. 各レシピには必ず「パパのこだわり（dadTips）」として、より美味しくなる裏技や、手際よく作るコツを含めること。
  `;

  const prompt = "冷蔵庫の中を見てくれ。パパっと作れる旨い飯を一緒に考えていこう。初心者でも迷わないように頼むぞ。";

  const imageParts = base64Images.map(data => ({
    inlineData: {
      mimeType: "image/jpeg",
      data: data,
    },
  }));

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          ...imageParts
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "画像から見つかった食材のリスト",
          },
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "料理名" },
                description: { type: Type.STRING, description: "料理の魅力" },
                cookingTime: { type: Type.STRING, description: "調理時間" },
                difficulty: { type: Type.STRING, enum: ["簡単", "普通", "少し頑張る"] },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.STRING },
                    },
                    required: ["name", "amount"],
                  },
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "調理手順",
                },
                dadTips: { type: Type.STRING, description: "パパからのこだわりアドバイス" },
              },
              required: ["title", "description", "cookingTime", "difficulty", "ingredients", "steps", "dadTips"],
            },
          },
        },
        required: ["detectedIngredients", "recipes"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as AnalysisResult;
};
