import { buildDr7SystemPrompt, MODEL_CONFIG } from '../lib/prompts.js';

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { parsedContext, modelId = 'medgemma-4b-it' } = req.body;

        const response = await fetch('https://dr7.ai/api/v1/medical/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DR7_API_KEY || process.env.VITE_DR7_API_KEY || 'sk-dr7-your-api-key'}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: "system",
                        content: buildDr7SystemPrompt()
                    },
                    {
                        role: "user",
                        content: parsedContext
                    }
                ],
                max_tokens: MODEL_CONFIG.dr7.maxTokens,
                temperature: MODEL_CONFIG.dr7.temperature
            })
        });

        const data = await response.json();

        if (response.ok) {
            const evaluation = data.choices[0].message.content;
            res.status(200).json({ evaluation });
        } else {
            res.status(response.status).json({ error: 'Dr7 processing failed', details: data });
        }
    } catch (error) {
        console.error('Dr7 Chat Error:', error);
        res.status(500).json({ error: 'Failed to query Dr7', message: error.message });
    }
}
