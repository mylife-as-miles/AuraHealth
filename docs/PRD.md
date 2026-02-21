# Product Requirements Document (PRD): AuraHealth

## 1. Product Vision & Goals
**Vision:** Shift the clinical paradigm from "passive documentation review" to "proactive risk surveillance."
**Goal:** Empower clinicians with an autonomous agentic framework that monitors incoming patient data (notes, vitals, labs), identifies subtle anomalies, and surfaces the highest-priority cases in a dynamic 'Clinical Attention Queue'.

## 2. Target Audience
1. **Attending Physicians:** Require immediate, explainable insights (AI reasoning) without black-box conclusions.
2. **Triage Nurses:** Need seamless tools to ingest raw, unstructured referral notes and patient history.
3. **Hospital Administrators:** Seek to reduce "Risk if ignored" liabilities and optimize cross-department workflow routing.

## 3. Core Features
### 3.1 The Clinical Attention Queue
- **Dynamic Prioritization**: The traditional patient directory is ranked not by admission time, but by MedGemma's computed urgency.
- **Explainable AI Badges**: Standard severity tags are replaced with MedGemma reasoning (e.g., "Vital deterioration").
- **Cost of Delay Metric**: A real-time "Risk if ignored" percentage to quantify the urgency.
- **Contextual Explanations**: Side-panel insights detailing deviations from patient baselines and historical comparisons.
- **Workflow Acceptance**: An actionable "Accept AI Priority" button to formally log the clinician's agreement with the AI's triage decision.

### 3.2 Unstructured Ingestion Agent
- **Visual Drag-and-Drop**: Allowing seamless ingestion of labs, imaging reports, and vitals.
- **Raw Note Parsing**: Text area explicitly designed to accept unstructured, 'messy' presenting symptoms and referral notes.
- **Context Parameterization**: Clinicians set the initial surveillance rules (Emergency, Routine, Post-operative) which act as system prompts for the AI tier.

## 4. Technical Integration (MedGemma via Dr7.ai)
- **Primary Endpoint**: `POST https://api.dr7.ai/v1/medical/chat/completions`
- **Authentication**: Bearer token via environment variables.

## 5. Next Implementation (Roadmap)
### Horizon 1 (Immediate Setup)
- **Live Endpoint Integration**: Transition the current simulated 1.5-second loading overlay to actual API calls hitting the `medgemma-27b-it` model for clinical reasoning, passing the unstructured drag-and-drop payloads.
- **Streaming Responses**: Implement Server-Sent Events (SSE) from the Dr7.ai API to stream the "Why This Patient Appeared" text directly into the UI.

### Horizon 2 (Multimodal & Specialized Agents)
- **Imaging Expansion**: Route uploaded X-rays from the drag-and-drop zone to the `chexagent` or `medsiglip-v1` models for specialized visual analysis before returning insights to the main MedGemma agent.
- **Genomic Integration**: Introduce support for `alphagenome` for long-term patient baseline generation.

### Horizon 3 (Edge AI)
- **Local Fallback**: Implement on-device WebGPU execution of `medgemma-4b-it` to maintain continuous surveillance capabilities if terrestrial network connectivity is lost during an emergency.
