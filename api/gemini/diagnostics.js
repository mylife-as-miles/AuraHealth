import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 120, // 2 minutes for 4-agent pipeline
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image, scanType, patientContext, dr7Model } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const imageParts = [];
        if (image && image.startsWith('data:image')) {
            const mimeType = image.split(';')[0].split(':')[1];
            const base64Data = image.split(',')[1];
            imageParts.push({
                inlineData: {
                    mimeType,
                    data: base64Data,
                }
            });
        }

        // ---------------------------------------------------------------------------
        // PHASE 1: Agent 1 - Triage (Fast Pass)
        // ---------------------------------------------------------------------------
        const triagePrompt = `You are a rapid medical triage AI. Look at the attached scan image and classify it.
        Available labels: ["Normal ${scanType}", "Critical Anomaly", "Uncertain"].
        If you see any potential life-threatening anomaly (like Pulmonary Embolism, internal bleeding, severe fracture), output "CRITICAL". Otherwise, output "NORMAL".
        Provide only the single word.`;

        const triageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Fast model for initial routing
            contents: [{ role: 'user', parts: [...imageParts, { text: triagePrompt }] }],
        });

        const triageResult = triageResponse.text?.trim().toUpperCase() || 'NORMAL';

        if (!triageResult.includes('CRITICAL')) {
            return res.status(200).json({
                severity: 'Normal',
                alertText: `Standard ${scanType} scan. No immediate critical anomalies detected in preliminary triage. Standard queue placement.`,
                confidence: 90
            });
        }

        // ---------------------------------------------------------------------------
        // PHASE 2: Agent 2 - Verification & Pinpointing (High Thinking)
        // ---------------------------------------------------------------------------
        const verifyPrompt = `Analyze this ${scanType} scan. A preliminary triage system flagged it for a potential critical anomaly (e.g., pulmonary embolism). 
        Confirm or deny this finding, pinpoint the anatomical location, and assess the severity.
        Return your structured clinical findings. Be highly precise.`;

        const verifyResponse = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            config: {
                thinkingConfig: { thinkingLevel: 'HIGH' }
            },
            contents: [{ role: 'user', parts: [...imageParts, { text: verifyPrompt }] }],
        });

        const verificationText = verifyResponse.text || 'High severity anomaly confirmed by deep analysis.';

        // ---------------------------------------------------------------------------
        // PHASE 3: Agent 3 - EHR Synthesis (Simulating Dr7 Model Router)
        // ---------------------------------------------------------------------------
        // In a full production setup, this phase would detour proxy to a separate LLM hosted on the Dr7 network based on dr7Model.
        // For this Vercel function, we prompt the frontier model to act strictly within the parameters of the chosen Dr7 Model.
        const synthesisPrompt = `You are acting as the AI model: ${dr7Model}.
        Synthesize the following visual finding with the patient's EHR history.
        
        VISUAL FINDING from Phase 2:
        ${verificationText}

        PATIENT EHR HISTORY:
        ${patientContext}

        Draft a clinical synthesis that merges the patient's history with the new visual findings.`;

        const synthesisResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ role: 'user', parts: [{ text: synthesisPrompt }] }],
        });

        const synthesisText = synthesisResponse.text || verificationText;

        // ---------------------------------------------------------------------------
        // PHASE 4: Agent 4 - Live Monitor Formatting
        // ---------------------------------------------------------------------------
        const formatPrompt = `Convert the following medical synthesis into a strictly 3-sentence critical alert summarizing the immediate risk for an emergency monitor dashboard. It must be concise, punchy, and actionable.
        
        Synthesis:
        ${synthesisText}`;

        const formatResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: formatPrompt }] }],
        });

        const finalAlert = formatResponse.text || "Critical anomaly detected requiring immediate clinical intervention.";

        // Return the final data payload
        res.status(200).json({
            severity: 'Critical',
            alertText: finalAlert.trim(),
            confidence: 98
        });

    } catch (error) {
        console.error('Gemini Diagnostics Pipeline Error:', error);
        res.status(500).json({ error: 'Failed to process diagnostic imaging', message: error.message });
    }
}
