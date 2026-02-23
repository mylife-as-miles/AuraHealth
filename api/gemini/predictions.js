import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { patients, cases } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const prompt = `You are a highly advanced AI clinical monitoring system analyzing an active hospital ward.
Based on the following active patients and recent diagnostic scans, generate 3 highly plausible "Prediction Alerts".
Ground your predictions in real-world epidemiology and medical reasoning.

Current active patients:
${patients.map(p => `- ID: ${p.id}, Age: ${p.age}, Condition: ${p.condition}, Risk: ${p.risk}`).join('\n')}

Recent diagnostic findings:
${cases.map(c => `- Scan: ${c.scanType}, Findings: ${c.findings?.map(f => f.title).join(', ') || 'Pending'}`).join('\n')}

Return EXACTLY a JSON array of 3 objects with this structure (no markdown wrappers, just raw JSON):
[
  {
    "id": "unique-string",
    "ward": "String (e.g. 'Cardiology Ward' or 'ICU')",
    "risk": "+X% Risk",
    "riskChange": Number (integer percentage change),
    "description": "String explaining the prediction using specific patient data.",
    "severity": "high" | "medium" | "low"
  }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingLevel: 'HIGH',
                },
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
            }
        });

        const raw = response.text || '[]';
        const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        let alerts;
        try {
            alerts = JSON.parse(cleaned);
        } catch {
            alerts = [];
        }

        return res.status(200).json({ alerts });
    } catch (err) {
        console.error('Predictions error:', err);
        return res.status(500).json({
            error: 'Prediction analysis failed',
            details: err.message,
        });
    }
}
