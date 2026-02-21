# Next Implementation & Technical Roadmap

This document outlines the specific architectural expansions and Dr7.ai API integrations planned for the next iteration of the AuraHealth platform. It bridges the gap between our current UI-driven Agentic Triage concept and a production-ready, fully autonomous clinical LLM pipeline.

---

## 1. Live Dr7.ai API Integration (The MedGemma Pipeline)

Currently, the `Activate Monitoring` button triggers a simulated loading sequence. The immediate next step is to replace this with a live API call to the Dr7.ai inference endpoints.

### 1.1 Unstructured Text Ingestion Pipeline
When a clinician pastes unstructured notes into the `Referral Notes / Presenting Symptoms` text area, the frontend will dispatch a request to `medgemma-27b-it` (or `medgemma-4b-it` for faster, lower-cost operations) to extract structured clinical entities and determine the initial triage priority.

**Implementation Blueprint (Frontend Service):**
```typescript
const analyzeReferralNotes = async (rawNotes: string, context: string) => {
  const response = await fetch('https://api.dr7.ai/v1/medical/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VITE_DR7_API_KEY}`
    },
    body: JSON.stringify({
      model: "medgemma-27b-it",
      messages: [
        {
          role: "system",
          content: `You are an autonomous triage agent operating in a ${context} context. Analyze the following unstructured referral notes. Output a JSON object containing: 1) "priority" (Routine, Moderate Risk, High Risk), 2) "aiReason" (a short 3-word justification), and 3) "riskPercentage" (an integer representing complication risk if ignored).`
        },
        {
          role: "user",
          content: rawNotes
        }
      ],
      max_tokens: 150,
      temperature: 0.2 // Low temperature for consistent clinical output
    })
  });
  
  return await response.json();
};
```

### 1.2 Streaming Reason Generation
Instead of a static "Why This Patient Appeared" box, we will utilize the Dr7.ai streaming API (`stream: true`) to generate the clinical justification in real-time. This provides immediate visual feedback to the clinician while the LLM synthesizes historical baselines with current vitals.

---

## 2. Multi-Modal Drag-and-Drop Architecture

The second phase involves activating the Drag-and-Drop zone to parse actual DICOM images, JPEGs (X-rays), and PDF lab reports using specialized vision models available on the Dr7 Hub.

### 2.1 Routing Vision Tasks
Different modalities require different models. We will implement an orchestration layer that routes files based on MIME type:

1. **Chest X-Rays / Imaging:** Routed to `chexagent` or `medsiglip-v1` for zero-shot pathology classification.
2. **Scanned PDF Lab Results:** Routed to `llava-med` to extract text and tabular data from raw images.

**Implementation Blueprint (Orchestrator):**
```typescript
const processMedicalAttachment = async (file: File) => {
  const base64Image = await convertToBase64(file);
  
  // Example routing logic for an X-ray
  const response = await fetch('https://api.dr7.ai/v1/medical/chat/completions', {
    method: 'POST',
    headers: { /* ...auth headers... */ },
    body: JSON.stringify({
      model: "chexagent", // Specialized imaging model
      messages: [
        {
          role: "user",
          content: [
             { type: "text", text: "Identify any critical abnormalities in this scan that require immediate escalation." },
             { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ]
    })
  });
  
  // The result of this specialized vision model is then appended to the 
  // master prompt sent to MedGemma-27b for the final triage decision.
};
```

---

## 3. The Edge AI Prize Integration (On-Device Inference)

A core requirement of modern clinical AI is resilience against network failures. We plan to leverage `medgemma-1.5-4b` via WebGPU to run localized inference directly within the browser (or a wrapped Electron/Tauri desktop app).

### 3.1 Local Fallback Mechanism
1. The app detects a drop in terrestrial connectivity (`navigator.onLine === false`).
2. The UI switches the Active Model indicator from cloud (`medgemma-27b`) to local (`medgemma-4b`).
3. Core triage tasks (parsing basic text inputs and generating urgency scores) are handed off to a local Web Worker running an ONNX or WebLLM-compiled version of the model.
4. This ensures the "Clinical Attention Queue" remains operational even in disconnected, high-stress environments like field hospitals or ambulances.

---

## 4. Background Agentic Surveillance (Cron Jobs)

To fully realize the "Agentic Workflow," AuraHealth cannot only rely on manual UI inputs. The final implementation phase involves a backend service (e.g., a Supabase Edge Function or Node.js worker) that actively polls an FHIR-compliant database every 5 minutes.

- If a patient's IoT vitals stream deviates from the LLM-established baseline, the backend agent autonomously triggers a `medgemma-27b-it` evaluation.
- If the AI deems the deviation critical, it strikes a Webhook to the frontend, pushing the patient to the top of the UI's `Clinical Attention Queue` and triggering the `<Zap />` high-severity UI badge.
