import { GoogleGenAI } from '@google/genai';
import { buildDr7SystemPrompt, MODEL_CONFIG } from '../lib/prompts.js';

export const config = {
  maxDuration: 120,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Setup response for streaming JSON lines
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const { query, modelId } = req.body;

    // 1. ANNOUNCE ANALYZING
    res.write(JSON.stringify({ status: 'analyzing' }) + '\n');

    // 2. QUERY DR7 FIRST
    const dr7Response = await fetch('https://dr7.ai/api/v1/medical/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DR7_API_KEY || process.env.VITE_DR7_API_KEY || 'sk-dr7-your-api-key'}`
      },
      body: JSON.stringify({
        model: modelId || 'medgemma-4b-it',
        messages: [
          { role: "system", content: buildDr7SystemPrompt() },
          { role: "user", content: `Please provide a preliminary medical analysis for this query: ${query}` }
        ],
        max_tokens: MODEL_CONFIG.dr7.maxTokens,
        temperature: MODEL_CONFIG.dr7.temperature
      })
    });

    let dr7Analysis = '';
    if (dr7Response.ok) {
      const dr7Data = await dr7Response.json();
      dr7Analysis = dr7Data.choices[0].message.content;
    } else {
      dr7Analysis = "Dr7 analysis unavailable. Proceeding with raw query.";
      console.warn('Dr7 backend failed, continuing pipeline...', await dr7Response.text());
    }

    // 3. ANNOUNCE SEARCHING & THINKING
    res.write(JSON.stringify({ status: 'searching' }) + '\n');

    // 4. QUERY GEMINI 3.1 PRO WITH TOOLS
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
    });

    const prompt = `You are a medical research assistant. 
        Original User Query: "${query}"
        
        Preliminary Dr7 Model Analysis:
        "${dr7Analysis}"
        
        Task: Synthesize the preliminary analysis and verify/expand it by searching recent published medical literature, guidelines, FDA, CDC, and more.
        
        Return a strictly formatted JSON object with the following structure:
        {
          "synthesis": "Markdown string containing the comprehensive, detailed clinical synthesis. Include huge citations and sources.",
          "confidence": Number (0-1, e.g., 0.96),
          "sources": [
            { "id": "1", "title": "Study Title", "journal": "Journal Name", "year": "2024", "url": "https://pubmed.ncbi.nlm.nih.gov/..." }
          ],
          "charts": [
            {
              "type": "risk_reduction",
              "title": "Risk Reduction (Hazard Ratio)",
              "data": [
                { "name": "Study Name", "value": 0.8, "min": 0.7, "max": 0.9, "color": "#54E097" }
              ]
            }
          ]
        }`;

    const tools = [
      { codeExecution: {} },
      { googleSearch: {} }
    ];

    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.1-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingLevel: 'HIGH' },
        tools: tools,
        responseMimeType: 'application/json',
      }
    });

    let fullJsonBody = '';
    let startedSynthesizing = false;

    for await (const chunk of stream) {
      if (!startedSynthesizing) {
        // As soon as we get the first chunk, we are "synthesizing"
        res.write(JSON.stringify({ status: 'synthesizing' }) + '\n');
        startedSynthesizing = true;
      }
      fullJsonBody += chunk.text;
    }

    // 5. ANNOUNCE FINISHED
    res.write(JSON.stringify({ status: 'finished' }) + '\n');

    // 6. SEND FINAL DATA
    try {
      const cleaned = fullJsonBody.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const finalData = JSON.parse(cleaned);
      res.write(JSON.stringify({ status: 'complete', data: finalData }) + '\n');
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", fullJsonBody);
      res.write(JSON.stringify({ status: 'error', message: 'Failed to format research data' }) + '\n');
    }

    res.end();

  } catch (err) {
    console.error('Research API error:', err);
    res.write(JSON.stringify({ status: 'error', message: err.message }) + '\n');
    res.end();
  }
}
