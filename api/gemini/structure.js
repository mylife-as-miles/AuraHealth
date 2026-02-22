import { GoogleGenAI } from '@google/genai';
import { buildStructurePrompt, STRUCTURE_SCHEMA, MODEL_CONFIG } from '../lib/prompts.js';

export const config = {
    maxDuration: 120,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { originalContext, dr7Evaluation } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const { model, thinkingLevel, tools, responseMimeType, temperature } = MODEL_CONFIG.structure;
        const genConfig = {
            thinkingConfig: {
                thinkingLevel,
            },
            tools,
            responseMimeType,
            responseSchema: STRUCTURE_SCHEMA,
            temperature,
        };

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: buildStructurePrompt(originalContext, dr7Evaluation),
                    },
                ],
            },
        ];

        // Use streaming for robustness against timeouts
        const response = await ai.models.generateContentStream({
            model,
            config: genConfig,
            contents,
        });

        let fullText = '';
        for await (const chunk of response) {
            if (chunk.text) {
                fullText += chunk.text;
            }
        }

        res.status(200).json({ structuredData: JSON.parse(fullText) });
    } catch (error) {
        console.error('Gemini Structure Error:', error);
        res.status(500).json({ error: 'Failed to structure output', message: error.message });
    }
}
