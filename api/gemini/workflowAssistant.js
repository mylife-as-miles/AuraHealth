import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 30, // 30 seconds since 2.5 Flash is very fast
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { card, allColumns } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const prompt = `
        You are an elite Clinical Workflow Assistant AI for AuraHealth, a hospital triage system.
        Analyze the current state of a patient in the hospital workflow and recommend 2 precise, actionable "next steps" for the clinical staff.

        PATIENT CONTEXT:
        - Name: ${card.patientName}
        - Condition/Reason for Visit: ${card.condition}
        - Triage Notes: ${card.triageNotes || 'None'}
        - Priority Level: ${card.priority}
        - Current Department/Column: ${card.column} (from available columns: ${allColumns.map(c => c.label).join(', ')})
        - Wait Time so far: ${card.time}

        TASK:
        Generate exactly 2 "Action Cards" (recommendations) and exactly 2 "Checklist Items" (nextSteps) for the clinical staff to take right now to advance this patient's care optimally.

        RULES:
        1. Keep the "title" extremely short (max 3 words).
        2. Keep the "description" highly specific to the patient's condition and current column.
        3. For Action Cards (recommendations), match the "icon" strictly to: "alert", "file", "stethoscope". Match "actionColor" to Tailwind classes like "hover:bg-accent hover:text-white" or "hover:bg-cyan hover:text-white".
        4. For Checklist Items (nextSteps), match the "icon" strictly to: "clipboard" or "stethoscope". Match "color" strictly to: "cyan" or "secondary" or "accent".

        Expected JSON response schema:
        {
            "recommendations": [
                {
                    "icon": "alert" | "file" | "stethoscope",
                    "title": "string",
                    "description": "string",
                    "actionLabel": "Submit Order",
                    "actionColor": "hover:bg-cyan hover:text-white hover:border-cyan"
                }
            ],
            "nextSteps": [
                {
                    "icon": "clipboard" | "stethoscope",
                    "title": "string",
                    "subtitle": "string",
                    "color": "cyan" | "secondary" | "accent"
                }
            ]
        }
        Return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            }
        });

        const text = response.text;

        try {
            const data = JSON.parse(text);
            return res.status(200).json(data);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            // Fallback to empty if AI hallucinates formatting
            return res.status(200).json({ recommendations: [], nextSteps: [] });
        }

    } catch (error) {
        console.error("Workflow Assistant Gemini error:", error);
        return res.status(500).json({ error: 'Failed to generate recommendations', recommendations: [], nextSteps: [] });
    }
}
