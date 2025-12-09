import { GoogleGenAI } from "@google/genai";
import { ReportData, DutyCategory, JD_DUTIES_MAP } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const polishReportContent = async (
  currentData: ReportData
): Promise<Partial<ReportData>> => {
  const client = getClient();
  
  // Construct a prompt that includes the context of the specific job description
  const contextPrompt = `
    You are an expert administrative assistant for a Government Web Designer. 
    Your task is to rewrite the user's rough weekly notes into professional, formal bullet points suitable for an official government report.
    
    The output must strictly align with the official "Duties and Responsibilities" of the role:
    ${Object.entries(JD_DUTIES_MAP).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

    Rules:
    1. Use active voice and professional terminology (e.g., "Spearheaded," "Executed," "Facilitated").
    2. Emphasize "accessibility," "compliance," and "citizen engagement" where relevant.
    3. Return the response as a valid JSON object with the following keys corresponding to the input data:
       - items: an array of objects with { id, description } where description is the polished text. (Maintain the original IDs).
       - summary: a professional executive summary of the week (max 3 sentences).
    
    Input Data:
    Summary Draft: ${currentData.summary}
    Items: ${JSON.stringify(currentData.items.map(i => ({ id: i.id, category: i.category, draft: i.description })))}
    
    Contextual Analytics Data (incorporate into summary if significant):
    - Page Views: ${currentData.analytics.pageViews}
    - Unique Visitors: ${currentData.analytics.uniqueVisitors}
    - Bounce Rate: ${currentData.analytics.bounceRate}
    - Avg Session: ${currentData.analytics.avgSessionDuration}
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsed = JSON.parse(resultText);
    
    // Map the polished descriptions back to the full item objects
    const polishedItems = currentData.items.map(item => {
      const polished = parsed.items?.find((p: any) => p.id === item.id);
      return polished ? { ...item, description: polished.description } : item;
    });

    return {
      items: polishedItems,
      summary: parsed.summary || currentData.summary
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};