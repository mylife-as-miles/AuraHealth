import { GoogleGenAI } from '@google/genai';
import { buildParsePrompt } from '../lib/prompts.js';

export const config = {
    maxDuration: 120,
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image, notes, pdfBase64 } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const parts = [];

        if (image && image.startsWith('data:image')) {
            const mimeType = image.split(';')[0].split(':')[1];
            const base64Data = image.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType,
                    data: base64Data,
                }
            });
        }

        if (pdfBase64 && pdfBase64.startsWith('data:application/pdf')) {
            const base64Data = pdfBase64.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: 'application/pdf',
                    data: base64Data,
                }
            });
        }

        parts.push({
            text: buildParsePrompt(notes),
        });

        const model = 'gemini-3.1-pro-preview';
        const tools = [{ googleSearch: {} }];
        const genConfig = {
            thinkingConfig: {
                thinkingLevel: 'HIGH',
            },
            tools,
        };

        // Use streaming for robustness against timeouts
        const response = await ai.models.generateContentStream({
            model,
            config: genConfig,
            contents: [{ role: 'user', parts }],
        });

        let fullText = '';
        for await (const chunk of response) {
            if (chunk.text) {
                fullText += chunk.text;
            }
        }

        res.status(200).json({ parsedContext: fullText });
    } catch (error) {
        console.error('Gemini Parse Error:', error);
        res.status(500).json({ error: 'Failed to parse inputs', message: error.message });
    }
}
