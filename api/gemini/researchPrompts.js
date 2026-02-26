import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 30, // 30 seconds should be plenty for Flash
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are accepted.' });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const prompt = `You are an intelligent medical research assistant. 
Your goal is to suggest 3 interesting, distinct, and highly relevant medical research queries that a physician might want to search for. 
For example: "Latest evidence on GLP-1 agonists for cardiovascular health", "Efficacy of PARP inhibitors in BRCA-mutated early breast cancer", or "Dual antiplatelet therapy vs monotherapy post-TAVR".
Return ONLY a valid JSON array of 3 strings. Do not use markdown blocks.
Example: ["Query 1", "Query 2", "Query 3"]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.9,
            }
        });

        const text = response.text;
        let prompts;
        try {
            prompts = JSON.parse(text);
            if (!Array.isArray(prompts)) prompts = ["Latest evidence on GLP-1 agonists for cardiovascular health in non-diabetic patients", "Efficacy of PARP inhibitors in BRCA-mutated early breast cancer", "Efficacy of dual antiplatelet therapy vs monotherapy post-TAVR"];
        } catch (e) {
            prompts = ["Latest evidence on GLP-1 agonists for cardiovascular health in non-diabetic patients", "Efficacy of PARP inhibitors in BRCA-mutated early breast cancer", "Efficacy of dual antiplatelet therapy vs monotherapy post-TAVR"];
        }

        return res.status(200).json({ prompts });
    } catch (error) {
        console.error('Error generating medical research prompts:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            prompts: [
                "Latest evidence on GLP-1 agonists for cardiovascular health in non-diabetic patients",
                "Efficacy of PARP inhibitors in BRCA-mutated early breast cancer",
                "Efficacy of dual antiplatelet therapy vs monotherapy post-TAVR"
            ]
        });
    }
}
