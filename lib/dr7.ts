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

// ─── Shared API helper ────────────────────────────────────────────────
async function callDr7Api(systemPrompt: string, userPrompt: string, maxTokens = 1000): Promise<string> {
    const apiKey = process.env.DR7_API_KEY;

    if (!apiKey) {
        const err = new Error("DR7_API_KEY is not configured. Add your API key to the .env file.");
        (err as any).code = 'NO_API_KEY';
        throw err;
    }

    const response = await fetch(DR7_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'medgemma-27b-it',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: maxTokens,
            temperature: 0.2
        })
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const errorMessage = (errorBody as any)?.error?.message || response.statusText;

        if (response.status === 401) { const e = new Error(`Invalid API key.`); (e as any).code = 'INVALID_API_KEY'; throw e; }
        if (response.status === 402) { const e = new Error(`Insufficient balance.`); (e as any).code = 'INSUFFICIENT_BALANCE'; throw e; }
        if (response.status === 429) { const e = new Error(`Rate limited.`); (e as any).code = 'RATE_LIMITED'; throw e; }

        throw new Error(`Dr7.ai API error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

function parseJson<T>(raw: string): T {
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
}

// ─── Flow A: Referral Note → AI Triage ────────────────────────────────
export interface TriageResult {
    priority: 'High Risk' | 'Moderate' | 'Low Risk';
    aiReason: string;
    riskPercentage: number;
    condition: string;
}

export async function triageReferralNotes(
    notes: string, context: string, age: number, gender: string
): Promise<TriageResult> {
    const prompt = `
Analyze the following unstructured referral notes for a ${age}-year-old ${gender} patient in a ${context} context.

Referral Notes:
"""
${notes}
"""

Return EXACTLY one JSON object (no markdown wrappers):
{
  "priority": "High Risk" | "Moderate" | "Low Risk",
  "aiReason": "3-5 word clinical justification (e.g. 'Acute cardiac deterioration')",
  "riskPercentage": integer 1-100 representing complication risk if ignored,
  "condition": "Primary suspected condition (e.g. 'Acute Myocardial Infarction')"
}
`;

    const raw = await callDr7Api(
        'You are MedGemma, an autonomous triage agent. Analyze referral notes and determine clinical priority. Always respond with valid JSON only.',
        prompt,
        500
    );

    return parseJson<TriageResult>(raw);
}

// ─── Flow B: "Why This Patient Appeared" — Streaming Reasoning ────────
export interface PatientReasoning {
    deviation: string;
    patternDetection: string;
    riskForecast: string;
}

export async function streamPatientReasoning(
    patient: Patient,
    onToken: (token: string) => void
): Promise<string> {
    const apiKey = process.env.DR7_API_KEY;

    if (!apiKey) {
        const err = new Error("DR7_API_KEY is not configured.");
        (err as any).code = 'NO_API_KEY';
        throw err;
    }

    const vitalsStr = patient.vitals.length > 0
        ? patient.vitals.slice(-5).map(v => `HR:${v.hr} BP:${v.sys}/${v.dia} Temp:${v.temp}°F`).join('; ')
        : 'No vitals recorded';

    const historyStr = patient.history.length > 0
        ? patient.history.slice(-3).map(h => `${h.date}: ${h.title} (${h.type})`).join('; ')
        : 'No history';

    const prompt = `
Patient: ${patient.name}, ${patient.age}yo ${patient.gender}
Condition: ${patient.condition}
Risk Level: ${patient.risk}
Recent Vitals: ${vitalsStr}
History: ${historyStr}
AI Summary: ${patient.aiSummary || 'None'}

As a HAI-DEF clinical monitoring system, explain WHY this patient was surfaced in the Clinical Attention Queue.
Write 3 concise lines of clinical reasoning:
1. How the patient's data deviates from their baseline (include a specific percentage)
2. What clinical pattern was detected (reference the number of comparable prior cases)
3. A time-bound risk forecast with escalation urgency

Be specific, data-grounded, and clinical. Do NOT use JSON. Write flowing clinical prose.
`;

    const response = await fetch(DR7_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'medgemma-27b-it',
            messages: [
                { role: 'system', content: 'You are MedGemma, a HAI-DEF clinical AI system providing real-time clinical reasoning. Be concise, specific, and data-grounded.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 400,
            temperature: 0.3,
            stream: true
        })
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const errorMessage = (errorBody as any)?.error?.message || response.statusText;
        if (response.status === 401) { const e = new Error('Invalid API key.'); (e as any).code = 'INVALID_API_KEY'; throw e; }
        if (response.status === 402) { const e = new Error('Insufficient balance.'); (e as any).code = 'INSUFFICIENT_BALANCE'; throw e; }
        if (response.status === 429) { const e = new Error('Rate limited.'); (e as any).code = 'RATE_LIMITED'; throw e; }
        throw new Error(`Dr7.ai API error (${response.status}): ${errorMessage}`);
    }

    // Read the SSE stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') break;

            try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) {
                    fullText += token;
                    onToken(token);
                }
            } catch {
                // Skip malformed chunks
            }
        }
    }

    return fullText;
}

// Keep non-streaming version as fallback
export async function generatePatientReasoning(patient: Patient): Promise<PatientReasoning> {
    const vitalsStr = patient.vitals.length > 0
        ? patient.vitals.slice(-5).map(v => `HR:${v.hr} BP:${v.sys}/${v.dia} Temp:${v.temp}°F`).join('; ')
        : 'No vitals recorded';

    const historyStr = patient.history.length > 0
        ? patient.history.slice(-3).map(h => `${h.date}: ${h.title} (${h.type})`).join('; ')
        : 'No history';

    const prompt = `
Patient: ${patient.name}, ${patient.age}yo ${patient.gender}
Condition: ${patient.condition}
Risk Level: ${patient.risk}
Recent Vitals: ${vitalsStr}
History: ${historyStr}
AI Summary: ${patient.aiSummary || 'None'}

As a HAI-DEF clinical monitoring system, explain WHY this patient was surfaced in the Clinical Attention Queue.
Return EXACTLY one JSON object (no markdown wrappers):
{
  "deviation": "A specific statement about how this patient's data deviates from their established baseline",
  "patternDetection": "What clinical pattern was detected across their records",
  "riskForecast": "A time-bound risk forecast with urgency"
}
`;

    const raw = await callDr7Api(
        'You are MedGemma, a HAI-DEF clinical AI system. Provide specific, data-grounded reasoning for clinical escalation. Always respond with valid JSON only.',
        prompt,
        600
    );

    return parseJson<PatientReasoning>(raw);
}

