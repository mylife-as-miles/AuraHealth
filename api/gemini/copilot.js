import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, patientContext } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const systemPrompt = `You are AuraHealth Copilot, a clinical AI assistant embedded in a hospital dashboard.
You help clinicians quickly understand patient data, risks, and recommended actions.
Be concise, professional, and clinically accurate. Use bullet points when listing items.
Always ground your answers in the patient context provided. If no patient is selected, provide general clinical guidance.
Never make up specific lab values or vitals — only reference data explicitly provided in the context.
Keep responses under 200 words unless specifically asked for detail.`;

        const patientSection = patientContext
            ? `\n\nCurrently selected patient context:\n${patientContext}`
            : '\n\nNo specific patient is currently selected. Provide general clinical guidance.';

        const geminiMessages = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));

        // Prepend the system prompt + patient context into the first user message
        if (geminiMessages.length > 0 && geminiMessages[0].role === 'user') {
            geminiMessages[0].parts[0].text =
                systemPrompt + patientSection + '\n\nUser question: ' + geminiMessages[0].parts[0].text;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: geminiMessages,
        });

        const text = response.text || 'I was unable to generate a response. Please try again.';

        return res.status(200).json({ response: text });
    } catch (err) {
        console.error('Copilot error:', err);
        return res.status(500).json({
            error: 'Copilot request failed',
            details: err.message,
        });
    }
}
