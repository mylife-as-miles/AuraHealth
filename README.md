# AuraHealth: Autonomous Clinical Triage

AuraHealth is an Agentic AI platform that transforms traditional, passive patient directories into an active, intelligent **Clinical Attention Queue**. Powered by Google DeepMind's open-weight MedGemma models via the Dr7.ai Medical API, AuraHealth acts as a tireless clinical assistant—ingesting unstructured medical records, establishing risk baselines, and prioritizing patients based on real-time urgency.

## 🚀 Tech Stack

### Frontend & UI
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for rapid, responsive UI development
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for timeline and diagnostic plotting)
- **Routing**: React Router DOM (v6)

### Data & State Management
- **Local Database**: Dexie.js (IndexedDB wrapper) provides a robust offline-capable, local-first architecture. This ensures rapid UI updates and maintains strict privacy boundaries before data is transmitted for AI inference.
- **State**: React hooks (`useState`, `useMemo`, `useEffect`) and Dexie live queries.

### AI Integration ( HAI-DEF & Dr7.ai )
- **Primary API**: Dr7.ai Medical API (`api.dr7.ai/v1/medical/chat/completions`)
- **Core Models**:
  - `medgemma-27b-it`: Utilized for complex clinical reasoning, differential diagnosis, and generating the "Why This Patient Appeared" explanations in the triage queue.
  - `medgemma-4b-it`: Utilized for lightweight, rapid NLP parsing of unstructured clinical referral notes and continuous surveillance tasks.

## 🏥 Application Pages & Features

1. **Dashboard (`/`)**
   - High-level overview of triage metrics, active clinical workflows, and urgent cases requiring immediate attention.

2. **Clinical Attention Queue (`/patients`)**
   - **Agentic Triage**: Replaces a standard CRM with an AI-prioritized inbox.
   - **Risk if Ignored Timer**: Calculates and displays the projected complication risk of delaying care.
   - **AI Reason Badges**: Replaces generic severity tags with specific triggers (e.g., "Pattern anomaly", "Vital deterioration").
   - **Unstructured Ingestion**: A drag-and-drop modal allowing clinicians to paste raw referral notes or upload labs/imaging for instant MedGemma analysis.

3. **Diagnostics Center (`/diagnostics`)**
   - Deep dive into patient lab results, imaging, and AI-generated radiological insights.

4. **Population AI Insights (`/ai-insights`)**
   - Macro-level analytics across the patient population powered by HAI-DEF models.

5. **Clinical Workflow (`/workflow`)**
   - Kanban-style triage board for managing active cases, departmental handoffs, and resource allocation.

6. **Settings (`/settings`)**
   - Manage API keys, select preferred Dr7.ai models (e.g., switching from MedGemma to CheXagent for specific wards), and configure surveillance strictness.
