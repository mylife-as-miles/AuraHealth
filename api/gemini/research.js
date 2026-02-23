import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const prompt = `You are a medical research assistant. Analyze the following query: "${query}".
        Provide a comprehensive clinical synthesis based on recent medical literature (RCTs, meta-analyses).

        Return a JSON object with the following structure:
        {
          "synthesis": "Markdown string containing the clinical synthesis. Use specific numbers and citations [1], [2].",
          "confidence": Number (0-1, e.g., 0.92),
          "sources": [
            { "id": "1", "title": "Study Title", "journal": "Journal Name", "year": "2024" }
          ],
          "charts": [
            {
              "type": "risk_reduction",
              "title": "MACE Risk Reduction (Hazard Ratio)",
              "data": [
                { "name": "Study Name", "value": 0.8, "min": 0.7, "max": 0.9, "color": "#54E097" }
              ]
            },
            {
              "type": "bar_comparison",
              "title": "Outcome Comparison",
              "data": [
                { "name": "Group A", "value": 10.5, "color": "#14F5D6" }
              ]
            }
          ]
        }

        Ensure the "synthesis" is detailed and professional.
        For "risk_reduction" charts, "value" is the Hazard Ratio, "min" and "max" are the Confidence Interval bounds.
        For "bar_comparison" charts, "value" is the absolute value (e.g., percentage weight loss).
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const raw = response.text || '{}';
        const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const data = JSON.parse(cleaned);

        return res.status(200).json(data);
    } catch (err) {
        console.error('Research API error:', err);
        return res.status(500).json({
            error: 'Research analysis failed',
            details: err.message,
        });
    }
}
