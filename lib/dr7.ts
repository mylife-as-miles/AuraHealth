import { Patient, DiagCase } from './types';

const DR7_API_URL = 'https://api.dr7.ai/v1/medical/chat/completions';

export interface PredictionAlert {
    id: string;
    ward: string;
    risk: string;
    riskChange: number;
    description: string;
    severity: 'high' | 'medium' | 'low';
}

export async function analyzePatientRisks(patients: Patient[], cases: DiagCase[]): Promise<PredictionAlert[]> {
    const apiKey = process.env.DR7_API_KEY;

    if (!apiKey) {
        const err = new Error("DR7_API_KEY is not configured. Add your API key to the .env file.");
        (err as any).code = 'NO_API_KEY';
        throw err;
    }

    const prompt = `
You are a highly advanced AI clinical monitoring system (MedGemma) analyzing an active hospital ward.
Based on the following active patients and recent diagnostic scans, generate 3 highly plausible "Prediction Alerts".
Ground your predictions in real-world epidemiology and medical reasoning.

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
    "description": "String explaining the prediction using specific patient data.",
    "severity": "high" | "medium" | "low"
  }
]
`;

    try {
        const response = await fetch(DR7_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'medgemma-27b-it',
                messages: [
                    {
                        role: 'system',
                        content: 'You are MedGemma, a medical AI assistant specializing in clinical risk prediction. Always respond with valid JSON only, no markdown formatting.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = (errorBody as any)?.error?.message || response.statusText;

            if (response.status === 401) {
                const err = new Error(`Invalid Dr7.ai API key. Check your DR7_API_KEY in .env.`);
                (err as any).code = 'INVALID_API_KEY';
                throw err;
            }
            if (response.status === 402) {
                const err = new Error(`Insufficient Dr7.ai account balance. Top up at dr7.ai.`);
                (err as any).code = 'INSUFFICIENT_BALANCE';
                throw err;
            }
            if (response.status === 429) {
                const err = new Error(`Dr7.ai rate limit exceeded. Please wait and try again.`);
                (err as any).code = 'RATE_LIMITED';
                throw err;
            }

            throw new Error(`Dr7.ai API error (${response.status}): ${errorMessage}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '[]';

        // Parse the JSON response — strip any accidental markdown wrappers
        const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const alerts: PredictionAlert[] = JSON.parse(cleaned);
        return alerts;

    } catch (error: any) {
        // Re-throw coded errors for the UI
        if (error?.code) throw error;

        console.error("Error generating prediction alerts with Dr7.ai MedGemma", error);
        throw error;
    }
}
