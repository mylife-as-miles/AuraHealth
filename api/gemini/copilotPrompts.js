import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 30, // 30 seconds for Flash
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const prompt = `You are an intelligent clinical copilot assistant. 
Your goal is to suggest 3 interesting, distinct, and highly relevant clinical queries that a hospital administrator or head physician might ask about their patient population. 
For example: "Summarize today's active prediction alerts", "Which patients have the highest cardiology risk?", or "Analyze the recent spike in respiratory cases".
Keep them concise. Return ONLY a valid JSON array of 3 strings. Do not use markdown blocks.
Example: ["Query 1", "Query 2", "Query 3"]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.9,
            }
        });

        const text = response.text();
        let prompts;
        try {
            prompts = JSON.parse(text);
            if (!Array.isArray(prompts)) prompts = ["Summarize today's active prediction alerts", "Which patients have the highest cardiology risk?", "Analyze the recent spike in respiratory cases"];
        } catch (e) {
            prompts = ["Summarize today's active prediction alerts", "Which patients have the highest cardiology risk?", "Analyze the recent spike in respiratory cases"];
        }

        return res.status(200).json({ prompts });
    } catch (error) {
        console.error('Error generating copilot prompts:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            prompts: [
                "Summarize today's active prediction alerts",
                "Which patients have the highest cardiology risk?",
                "Analyze the recent spike in respiratory cases"
            ]
        });
    }
}
