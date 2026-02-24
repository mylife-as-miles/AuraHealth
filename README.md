# AuraHealth: Autonomous Clinical Triage

AuraHealth is an Agentic AI platform that transforms traditional, passive patient directories into an active, intelligent **Clinical Attention Queue**. Powered by Google DeepMind's open-weight MedGemma models via the Dr7.ai Medical API and the latest **Gemini** frontier models, AuraHealth acts as a tireless clinical assistant—ingesting unstructured medical records, establishing risk baselines, synthesizing medical literature, and prioritizing patients based on real-time urgency.

## 🚀 Tech Stack

### Frontend & UI
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for rapid, responsive UI development
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for timeline plotting and dynamic AI-generated evidence visualization)
- **Routing**: React Router DOM (v6)

### Data & State Management
- **Local Database**: Dexie.js (IndexedDB wrapper) provides a robust offline-capable, local-first architecture. This ensures rapid UI updates and maintains strict privacy boundaries before data is transmitted for AI inference.
- **State**: React hooks (`useState`, `useMemo`, `useEffect`) and Dexie live queries.

### AI Integration & Serverless
- **Google Gemini SDK (`@google/genai`)**:
  - `gemini-3.1-pro-preview`: Used for complex medical research, utilizing **Google Search Grounding** to read real clinical literature, FDA guidelines, and generate accurate synthesis with dynamic citations and data visualizations (Forest/Bar charts). It also leverages High Thinking configurations for extreme accuracy.
  - `gemini-2.5-flash`: Drives the **AuraHealth Copilot**, rapid pre-triage routing, and dynamic contextual prompt generation for interactive empty states across the application.
- **Dr7.ai Medical API**: 
  - `medgemma-27b-it` / `medgemma-4b-it`: Specialized medical logic for parsing structured EHR and clinical notes.
- **Backend Architecture**: Vercel Serverless Functions (`api/gemini/*`) handle streaming AI responses, multi-agent orchestrations, and secure API key management.

## 🏥 Application Pages & Features

1. **Dashboard (`/`)**
   - High-level overview of triage metrics, active clinical workflows, and urgent cases requiring immediate attention.

2. **Clinical Attention Queue (`/patients`)**
   - **Agentic Triage**: Replaces a standard CRM with an AI-prioritized inbox.
   - **Risk if Ignored Timer**: Calculates and displays the projected complication risk of delaying care.
   - **AI Reason Badges**: Replaces generic severity tags with specific triggers (e.g., "Pattern anomaly", "Vital deterioration").
   - **Unstructured Ingestion**: A drag-and-drop modal allowing clinicians to paste raw referral notes or upload labs/imaging for instant MedGemma analysis.

3. **Medical Research Center**
   - An advanced search engine for clinicians, powered by Gemini 3.1 Pro. Retrieves real-time data from PubMed, CDC, and FDA using natively integrated Google Search capabilities.
   - Returns deeply sourced clinical syntheses, AI-generated Follow-Up Questions, and dynamically rendered **Evidence Visualizations** (e.g., Risk Reduction scatter plots or Efficacy bar charts) built autonomously from the scraped data matrices.

4. **AI Insights & AuraHealth Copilot (`/ai-insights`)**
   - Interactive population-level analytics and historical AI Triage Risk Trends visualizations.
   - Features the integrated **Copilot**, an ambient chat interface ready to field population and administrative queries, complete with predictive, clinically-relevant prompt suggestions.

5. **Diagnostics Center (`/diagnostics`)**
   - Deep dive into patient lab results and medical imaging.
   - **Multi-Agent Pipeline**: Ingests radiological images using an autonomous architectural flow (Triage Fast Pass leveraging Flash -> High Thinking Verification leveraging 3.1 Pro -> Simulated EHR Synthesis) to recreate real-world specialist routing logic.

6. **Clinical Workflow (`/workflow`)**
   - Kanban-style triage board for managing active cases, departmental handoffs, and resource allocation.
   - Includes real-time rendering of active diagnostic queues via IndexedDB integrations.

7. **Settings (`/settings`)**
   - Manage API keys, select preferred models (e.g., switching from MedGemma to an alternative logic router), and configure queue strictness.
