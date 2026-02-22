import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 60, // 60 seconds max duration for the serverless function
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
            text: `Analyze the provided medical inputs (image, PDF, and notes). 
      Extract a comprehensive and structured clinical summary. 
      Raw Clinical Notes: ${notes || 'None provided.'}
      
      Output ONLY a raw string representing the unified clinical context. No markdown formatting.`,
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts }],
        });

        res.status(200).json({ parsedContext: response.text });
    } catch (error) {
        console.error('Gemini Parse Error:', error);
        res.status(500).json({ error: 'Failed to parse inputs', message: error.message });
    }
}
