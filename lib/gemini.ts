import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Patient, DiagCase } from './types';

// The new SDK requires API key to be set
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

export interface PredictionAlert {
    id: string;
    ward: string;
    risk: string;
    riskChange: number;
    description: string;
    severity: 'high' | 'medium' | 'low';
}

export async function analyzePatientRisks(patients: Patient[], cases: DiagCase[]): Promise<PredictionAlert[]> {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set. Prediction alerts will be unavailable.");
        return [];
    }

    // Define the schema for structured output so we don't have to parse raw JSON
    // Due to SDK differences, we provide instructions on formatting JSON in the system prompt rather than strictly binding responseSchema in this version 
    // to avoid complex schema generation if we just want a simple array

    const prompt = `
You are a highly advanced AI clinical monitoring system (MedGemma) analyzing an active hospital ward.
Based on the following active patients and recent diagnostic scans, generate 3 highly plausible "Prediction Alerts".
You have access to Google Search. You must ground your predictions in real-world epidemiology, current weather/season, or recent verified medical literature if applicable.

Current active patients:
${patients.map(p => `- ID: ${p.id}, Age: ${p.age}, Condition: ${p.condition}, Risk: ${p.risk}`).join('\n')}

Recent diagnostic findings:
${cases.map(c => `- Scan: ${c.scanType}, Findings: ${c.findings.map(f => f.title).join(', ')}`).join('\n')}

Return EXACTLY a JSON array of 3 objects with this structure (do not include markdown \`\`\`json wrappers):
[
  {
    "id": "unique-string",
    "ward": "String (e.g. 'Cardiology Ward' or 'ICU')",
    "risk": "+X% Risk", 
    "riskChange": Number (integer percentage change),
    "description": "String explaining the prediction using specific patient data and potentially grounded external data.",
    "severity": "high" | "medium" | "low"
  }
]
`;

    const tools = [
        {
            googleSearch: {}
        },
    ];

    const config = {
        thinkingConfig: {
            // The enum might not be exported perfectly depending on typescript setup, using the string equivalent
            thinkingLevel: 'medium' as any,
        },
        tools,
        responseMimeType: 'application/json',
    };

    const model = 'gemini-3.1-pro-preview';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ];

    try {
        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });

        // We didn't stream because we need the final parsed JSON array for the React component state,
        // although streaming is possible, for a structured array, we await the complete payload.
        const text = response.text || "[]";
        const alerts: PredictionAlert[] = JSON.parse(text);
        return alerts;

    } catch (error) {
        console.error("Error generating prediction alerts with Gemini 3.1 Pro", error);
        return [];
    }
}
