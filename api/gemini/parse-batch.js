import { GoogleGenAI } from '@google/genai';
import { buildParsePrompt, MODEL_CONFIG } from '../lib/prompts.js';

export const config = {
    maxDuration: 120,
};

/**
 * Parallel 4-Worker Batch Parse Endpoint
 * 
 * Accepts up to 4 files (images/PDFs) + clinical notes.
 * Spawns parallel Gemini workers to parse each file simultaneously,
 * then merges all outputs into a single unified clinical context.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { files, notes } = req.body;
        // files: Array<{ dataUrl: string, type: string, name: string }> — up to 4

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
        });

        const { model, thinkingLevel, tools } = MODEL_CONFIG.parse;
        const genConfig = {
            thinkingConfig: { thinkingLevel },
            tools,
        };

        // Build individual worker tasks — one per file
        const workerTasks = (files || []).slice(0, 4).map((file, index) => {
            const parts = [];

            // Attach the file as inline data
            if (file.dataUrl && file.type === 'application/pdf' && file.dataUrl.startsWith('data:application/pdf')) {
                parts.push({
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: file.dataUrl.split(',')[1],
                    }
                });
            } else if (file.dataUrl && file.type?.startsWith('image/')) {
                const mimeType = file.dataUrl.split(';')[0].split(':')[1];
                parts.push({
                    inlineData: {
                        mimeType,
                        data: file.dataUrl.split(',')[1],
                    }
                });
            }

            parts.push({
                text: buildParsePrompt(
                    `[Worker ${index + 1} of ${Math.min(files.length, 4)}] ` +
                    `Analyzing file: "${file.name}" (${file.type}).\n\n` +
                    (notes || 'No additional clinical notes.')
                ),
            });

            return { parts, fileName: file.name, index };
        });

        // If no files provided, just parse the notes
        if (workerTasks.length === 0) {
            const parts = [{ text: buildParsePrompt(notes || 'None provided.') }];
            const response = await ai.models.generateContentStream({
                model,
                config: genConfig,
                contents: [{ role: 'user', parts }],
            });
            let fullText = '';
            for await (const chunk of response) {
                if (chunk.text) fullText += chunk.text;
            }
            return res.status(200).json({
                parsedContext: fullText,
                workerResults: [],
                workerCount: 0,
            });
        }

        // Launch all workers in parallel
        const workerPromises = workerTasks.map(async (task) => {
            try {
                const response = await ai.models.generateContentStream({
                    model,
                    config: genConfig,
                    contents: [{ role: 'user', parts: task.parts }],
                });

                let fullText = '';
                for await (const chunk of response) {
                    if (chunk.text) fullText += chunk.text;
                }

                return {
                    index: task.index,
                    fileName: task.fileName,
                    status: 'success',
                    output: fullText,
                };
            } catch (error) {
                console.error(`Worker ${task.index + 1} failed for "${task.fileName}":`, error.message);
                return {
                    index: task.index,
                    fileName: task.fileName,
                    status: 'failed',
                    output: `[Worker ${task.index + 1} FAILED] Unable to parse "${task.fileName}": ${error.message}`,
                };
            }
        });

        const workerResults = await Promise.all(workerPromises);

        // Sort results back to original order
        workerResults.sort((a, b) => a.index - b.index);

        // Merge all worker outputs into a unified clinical context
        const successCount = workerResults.filter(r => r.status === 'success').length;
        const unifiedContext = [
            `═══ UNIFIED CLINICAL CONTEXT ═══`,
            `Parsed from ${successCount}/${workerResults.length} documents via parallel MedExtract workers.\n`,
            ...workerResults.map((r) =>
                `── Document ${r.index + 1}: ${r.fileName} [${r.status.toUpperCase()}] ──\n${r.output}`
            ),
            `\n═══ END OF UNIFIED CONTEXT ═══`,
        ].join('\n\n');

        res.status(200).json({
            parsedContext: unifiedContext,
            workerResults: workerResults.map(r => ({
                fileName: r.fileName,
                status: r.status,
            })),
            workerCount: workerResults.length,
        });

    } catch (error) {
        console.error('Batch Parse Error:', error);
        res.status(500).json({ error: 'Failed to batch parse inputs', message: error.message });
    }
}
