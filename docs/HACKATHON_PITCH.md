# The MedGemma Impact Challenge: Submission

### Project name
AuraHealth - Autonomous Clinical Triage

### Your team
Osita Miles

### Problem statement
Clinicians are drowning in unstructured patient data, leading to alarm fatigue and delayed interventions. Traditional Electronic Health Records (EHRs) act as passive databases—they wait for a doctor to search for a problem. When a critical lab result or a subtle pattern of vital deterioration occurs, it is often missed until a human manually reviews the chart. The unmet need is a system that actively shifts the paradigm from 'data retrieval' to 'autonomous risk surveillance,' ensuring the most urgent patients are brought to the forefront immediately. If solved, this solution would drastically reduce the "Risk if ignored" complication rates, lower clinician burnout, and optimize hospital workflow routing.

### Overall solution
AuraHealth transforms the passive "Patient Directory" into a dynamic "Clinical Attention Queue" powered by MedGemma. By deploying HAI-DEF models as continuous background agents, AuraHealth parses unstructured referral notes and drag-and-drop lab results (Unstructured Ingestion). It establishes a risk baseline for each patient and actively ranks the queue based on AI-derived urgency. Rather than black-box alerts, the system utilizes `medgemma-27b-it` to generate highly specific "AI Reason Badges" and a dedicated "Why This Patient Appeared" panel, directly citing deviations from the patient's baseline to build clinical trust. We are submitting this for the **Main Track ($30,000)** for its exceptional technical execution and real-world impact potential, as well as the **Agentic Workflow Prize ($5,000)** because AuraHealth reimagines the standard EHR into an autonomous triage agent capable of parsing raw clinical notes and labs.

### Technical details
AuraHealth is built on a local-first React and Dexie.js (IndexedDB) architecture, ensuring rapid, HIPAA-compliant UI rendering while acting as the orchestration layer for the AI agents. 
- **Model Usage**: We utilize the Dr7.ai Medical API to access `medgemma-27b-it` for complex reasoning (generating the clinical justifications in the side-panel) and `medgemma-4b-it` for rapid parsing of the initial unstructured drag-and-drop ingestion. 
- **Agentic Workflow**: When a patient is registered, the UI executes a multi-step agentic pipeline: (1) Parsing clinical history, (2) Establishing risk baseline, and (3) Adding to the attention queue. 
- **Feasibility & Deployment**: The product is immediately feasible as a web application. The primary challenge involves handling massive, multi-modal unstructured payloads (like full imaging arrays). Our deployment roadmap addresses this by routing specialized tasks to models like `chexagent` while allowing `medgemma-27b-it` to serve as the master orchestrator, synthesizing the final triage queue priorities.
