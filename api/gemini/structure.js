import { GoogleGenAI } from '@google/genai';

export const config = {
    maxDuration: 60,
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

        const schema = {
            type: "object",
            properties: {
                conditionInfo: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        severity: { type: "string" },
                        confidence: { type: "number" },
                        keyIndicators: { type: "array", items: { type: "string" } }
                    }
                },
                doctorReport: { type: "string" },
                diagnostics: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            category: { type: "string" },
                            findings: { type: "array", items: { type: "string" } },
                            status: { type: "string", enum: ["critical", "warning", "normal"] }
                        }
                    }
                },
                recommendedActions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            type: { type: "string" },
                            description: { type: "string" },
                            priority: { type: "string", enum: ["high", "medium", "low"] }
                        }
                    }
                }
            },
            required: ["conditionInfo", "doctorReport", "diagnostics", "recommendedActions"]
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `You are an expert clinical structurer.
      Take the original patient context and the Dr7 Medical AI evaluation and output a structured JSON object matching the provided schema.
      
      Original Context:
      ${originalContext}
      
      Dr7 Evaluation:
      ${dr7Evaluation}
      
      Ensure the doctorReport field contains a comprehensive Markdown-formatted report suitable for clinical review, synthesizing the findings and the AI evaluation.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 0.1,
            }
        });

        res.status(200).json({ structuredData: JSON.parse(response.text) });
    } catch (error) {
        console.error('Gemini Structure Error:', error);
        res.status(500).json({ error: 'Failed to structure output', message: error.message });
    }
}
