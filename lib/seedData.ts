import { Patient, DiagCase, WorkflowCard, NotificationItem, AppSettings, Finding, Annotation, Diagnosis } from './types';
import { db } from './db';

const generateVitals = (baseHr: number, baseSys: number) => [
    { time: '08:00', hr: baseHr, sys: baseSys, dia: 75, temp: 98.4, weight: 142 },
    { time: '10:00', hr: baseHr + 6, sys: baseSys + 3, dia: 78, temp: 98.5, weight: 142 },
    { time: '12:00', hr: baseHr + 16, sys: baseSys + 20, dia: 85, temp: 98.9, weight: 142.2 },
    { time: '14:00', hr: baseHr + 10, sys: baseSys + 10, dia: 82, temp: 98.6, weight: 142 },
    { time: '16:00', hr: baseHr + 23, sys: baseSys + 23, dia: 88, temp: 98.7, weight: 142 },
    { time: '18:00', hr: baseHr + 13, sys: baseSys + 5, dia: 80, temp: 98.5, weight: 142 },
];

export const MOCK_PATIENTS: Patient[] = [
    {
        id: "#AH-1001",
        name: "Eleanor Voss",
        age: 67,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-10-24",
        condition: "Atrial Fibrillation",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(88, 135),
        medications: [
            { name: 'Warfarin', dosage: '5mg', freq: 'Once daily', time: '06:00 PM', type: 'pill' },
            { name: 'Digoxin', dosage: '250mcg', freq: 'Once daily', time: '08:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Oct 24, 2024', title: 'Arrhythmia Output', type: 'Diagnosis', description: 'Detected irregular heartbeat during stress test.' },
            { date: 'Sep 12, 2024', title: 'Emergency Department', type: 'Visit', description: 'Patient complained of chest palpitations.' }
        ],
        insurance: { provider: 'Medicare', policy: '#MC-992-221' },
        aiSummary: "Patient shows signs of persistent arrhythmia. Recommended immediate detailed cardiac screening. HAI-DEF model predicts 15% increase in stroke risk without anticoagulation adjustment."
    },
    {
        id: "#AH-1002",
        name: "Marcus Chen",
        age: 45,
        gender: "Male",
        initials: "MC",
        lastVisit: "2024-12-01",
        condition: "Type 2 Diabetes",
        risk: "High Risk",
        riskColor: "accent",
        active: false,
        vitals: generateVitals(82, 145),
        medications: [
            { name: 'Metformin', dosage: '1000mg', freq: 'Twice daily', time: '08:00 AM', type: 'pill' },
            { name: 'Lisinopril', dosage: '20mg', freq: 'Once daily', time: '09:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Dec 01, 2024', title: 'A1C Check', type: 'Routine', description: 'A1C at 8.2%. Medication adjusted.' }
        ],
        insurance: { provider: 'BlueCross', policy: '#BC-445-99' },
        aiSummary: "Diabetes management is suboptimal. Hypertension comorbidity increases cardiovascular risk. Recommend dietary consultation."
    },
    {
        id: "#AH-1003",
        name: "Aisha Okonkwo",
        age: 34,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-11-15",
        condition: "Pregnancy (High-Risk)",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(75, 128),
        medications: [
            { name: 'Prenatal Vitamins', dosage: '1 tab', freq: 'Daily', time: '08:00 AM', type: 'pill' },
            { name: 'Insulin (Gestational)', dosage: 'Various', freq: 'Correction', time: 'As needed', type: 'injection' }
        ],
        history: [
            { date: 'Nov 15, 2024', title: 'Ultrasound', type: 'Routine', description: '24-week scan showing normal fetal development.' }
        ],
        insurance: { provider: 'Aetna', policy: '#AE-112-44' },
        aiSummary: "Gestational diabetes requires strict monitoring. Fetal growth is on track."
    },
    {
        id: "#AH-1004",
        name: "James Whitfield",
        age: 72,
        gender: "Male",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-10-05",
        condition: "COPD Stage III",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(92, 138),
        medications: [
            { name: 'Tiotropium', dosage: '18mcg', freq: 'Daily', time: '08:00 AM', type: 'pill' },
            { name: 'Albuterol', dosage: '90mcg', freq: 'PRN', time: 'As needed', type: 'pill' }
        ],
        history: [
            { date: 'Oct 05, 2024', title: 'Exacerbation', type: 'Visit', description: 'Admitted for shortness of breath.' }
        ],
        insurance: { provider: 'Medicare', policy: '#MC-555-01' },
        aiSummary: "Frequent exacerbations noted. Oxygen saturation drops below 88% during exertion. Home oxygen therapy recommended."
    },
    {
        id: "#AH-1005",
        name: "Sofia Ramirez",
        age: 28,
        gender: "Female",
        initials: "SR",
        lastVisit: "2024-12-10",
        condition: "Systemic Lupus (SLE)",
        risk: "Moderate",
        riskColor: "yellow",
        active: false,
        vitals: generateVitals(78, 120),
        medications: [
            { name: 'Hydroxychloroquine', dosage: '200mg', freq: 'Twice daily', time: '08:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Dec 10, 2024', title: 'Rheumatology', type: 'Visit', description: 'Joint pain flare-up reported.' }
        ],
        insurance: { provider: 'UnitedHealthcare', policy: '#UH-882-11' },
        aiSummary: "SLE currently active with mild symptoms. Renal function remains normal."
    },
    {
        id: "#AH-1006",
        name: "Robert Tanaka",
        age: 55,
        gender: "Male",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-11-20",
        condition: "Post-MI Recovery",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(68, 110),
        medications: [
            { name: 'Clopidogrel', dosage: '75mg', freq: 'Daily', time: '09:00 AM', type: 'pill' },
            { name: 'Atorvastatin', dosage: '80mg', freq: 'Daily', time: '09:00 PM', type: 'pill' }
        ],
        history: [
            { date: 'Nov 20, 2024', title: 'Cardiology Follow-up', type: 'Routine', description: 'Stent checks out fine. EF 45%.' }
        ],
        insurance: { provider: 'Cigna', policy: '#CG-332-12' },
        aiSummary: "Recovery proceeding well. Ejection fraction slightly reduced but stable. Lipid profile improving."
    },
    {
        id: "#AH-1007",
        name: "Priya Sharma",
        age: 41,
        gender: "Female",
        initials: "PS",
        lastVisit: "2024-12-05",
        condition: "Breast Cancer (Stage II)",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(80, 115),
        medications: [
            { name: 'Tamoxifen', dosage: '20mg', freq: 'Daily', time: '08:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Dec 05, 2024', title: 'Oncology', type: 'Visit', description: 'Discussed chemotherapy schedule.' }
        ],
        insurance: { provider: 'BlueCross', policy: '#BC-119-22' },
        aiSummary: "Patient undergoing adjuvant therapy. Monitor for neutropenia."
    },
    {
        id: "#AH-1008",
        name: "William O'Brien",
        age: 63,
        gender: "Male",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-10-30",
        condition: "Chronic Kidney Disease",
        risk: "Moderate",
        riskColor: "yellow",
        active: false,
        vitals: generateVitals(74, 142),
        medications: [
            { name: 'Furosemide', dosage: '40mg', freq: 'Daily', time: '08:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Oct 30, 2024', title: 'Nephrology', type: 'Routine', description: 'GFR stability check. eGFR 42.' }
        ],
        insurance: { provider: 'Medicare', policy: '#MC-771-00' },
        aiSummary: "Stage 3 CKD. Blood pressure control is critical to slow progression. Potassium levels normal."
    },
    {
        id: "#AH-1009",
        name: "Mei-Lin Wu",
        age: 39,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-11-25",
        condition: "Depressive Disorder",
        risk: "Moderate",
        riskColor: "yellow",
        active: false,
        vitals: generateVitals(65, 110),
        medications: [
            { name: 'Sertraline', dosage: '50mg', freq: 'Daily', time: '08:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Nov 25, 2024', title: 'Psychiatry', type: 'Visit', description: 'Medication adjustment.' }
        ],
        insurance: { provider: 'Aetna', policy: '#AE-332-11' },
        aiSummary: "Patient reports improved mood but lingering insomnia. Continuing current regimen."
    },
    {
        id: "#AH-1010",
        name: "David Okafor",
        age: 50,
        gender: "Male",
        initials: "DO",
        lastVisit: "2024-12-12",
        condition: "HIV (Well-Controlled)",
        risk: "Low Risk",
        riskColor: "secondary",
        active: false,
        vitals: generateVitals(70, 120),
        medications: [
            { name: 'Biktarvy', dosage: '1 tab', freq: 'Daily', time: '09:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Dec 12, 2024', title: 'Infectious Disease', type: 'Routine', description: 'Viral load undetectable.' }
        ],
        insurance: { provider: 'Cigna', policy: '#CG-991-00' },
        aiSummary: "Excellent adherence to ART. CD4 count stable >600."
    },
    {
        id: "#AH-1011",
        name: "Clara Bennett",
        age: 76,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1551836022-d50d847330d4?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-11-05",
        condition: "Alzheimer's (Early)",
        risk: "Moderate",
        riskColor: "yellow",
        active: true,
        vitals: generateVitals(68, 130),
        medications: [
            { name: 'Donepezil', dosage: '5mg', freq: 'Daily', time: '08:00 PM', type: 'pill' }
        ],
        history: [
            { date: 'Nov 05, 2024', title: 'Neurology', type: 'Visit', description: 'MMSE score 22/30.' }
        ],
        insurance: { provider: 'Medicare', policy: '#MC-221-33' },
        aiSummary: "Cognitive decline progressing slowly. Family support is strong."
    },
    {
        id: "#AH-1012",
        name: "Hassan Al-Rashid",
        age: 31,
        gender: "Male",
        initials: "HA",
        lastVisit: "2024-12-08",
        condition: "Crohn's Disease",
        risk: "Moderate",
        riskColor: "yellow",
        active: false,
        vitals: generateVitals(72, 118),
        medications: [
            { name: 'Adalimumab', dosage: '40mg', freq: 'Bi-weekly', time: 'Day 1/15', type: 'injection' }
        ],
        history: [
            { date: 'Dec 08, 2024', title: 'Gastroenterology', type: 'Routine', description: 'Remission maintained.' }
        ],
        insurance: { provider: 'Aetna', policy: '#AE-772-22' },
        aiSummary: "Inflammatory markers low. Continue biologic therapy."
    },
    {
        id: "#AH-1013",
        name: "Elena Petrova",
        age: 58,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-10-15",
        condition: "Rheumatoid Arthritis",
        risk: "Moderate",
        riskColor: "yellow",
        active: false,
        vitals: generateVitals(70, 125),
        medications: [
            { name: 'Methotrexate', dosage: '15mg', freq: 'Weekly', time: 'Sunday', type: 'pill' }
        ],
        history: [
            { date: 'Oct 15, 2024', title: 'Rheumatology', type: 'Routine', description: 'Morning stiffness improved.' }
        ],
        insurance: { provider: 'BlueCross', policy: '#BC-332-11' },
        aiSummary: "Disease activity score shows improvement. Monitor liver function."
    },
    {
        id: "#AH-1014",
        name: "Tyler Jackson",
        age: 22,
        gender: "Male",
        image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-12-14",
        condition: "Type 1 Diabetes",
        risk: "Low Risk",
        riskColor: "secondary",
        active: false,
        vitals: generateVitals(65, 115),
        medications: [
            { name: 'Insulin Aspart', dosage: 'Bolus', freq: 'Meals', time: 'With food', type: 'injection' }
        ],
        history: [
            { date: 'Nov 14, 2024', title: 'Endocrinology', type: 'Routine', description: 'Pump data review. Excellent control.' }
        ],
        insurance: { provider: 'Cigna', policy: '#CG-882-00' },
        aiSummary: "Patient is highly engaged in self-management. Hemoglobin A1c 6.5%."
    },
    {
        id: "#AH-1015",
        name: "Grace Nakamura",
        age: 47,
        gender: "Female",
        initials: "GN",
        lastVisit: "2024-09-20",
        condition: "Thyroid Cancer",
        risk: "Low Risk",
        riskColor: "secondary",
        active: false,
        vitals: generateVitals(72, 120),
        medications: [
            { name: 'Levothyroxine', dosage: '125mcg', freq: 'Daily', time: '07:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Sep 20, 2024', title: 'Endocrinology', type: 'Routine', description: 'Thyroglobulin undetectable.' }
        ],
        insurance: { provider: 'UnitedHealthcare', policy: '#UH-112-99' },
        aiSummary: "Remission status stable. TSH suppressed as per protocol."
    },
    {
        id: "#AH-1016",
        name: "Benjamin Cruz",
        age: 69,
        gender: "Male",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-11-10",
        condition: "Parkinson's Disease",
        risk: "Moderate",
        riskColor: "yellow",
        active: true,
        vitals: generateVitals(76, 132),
        medications: [
            { name: 'Carbidopa-Levodopa', dosage: '25/100', freq: 'TID', time: '8-2-8', type: 'pill' }
        ],
        history: [
            { date: 'Nov 10, 2024', title: 'Neurology', type: 'Visit', description: 'Tremor slightly worse on right side.' }
        ],
        insurance: { provider: 'Medicare', policy: '#MC-441-22' },
        aiSummary: "Motor symptoms fluctuating. Consider adjusting dosing interval."
    },
    {
        id: "#AH-1017",
        name: "Fatima Al-Hassan",
        age: 36,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1545996124-0501ebae84d0?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-12-02",
        condition: "Severe Asthma",
        risk: "Moderate",
        riskColor: "yellow",
        active: false,
        vitals: generateVitals(80, 120),
        medications: [
            { name: 'Fluticasone/Salmeterol', dosage: '250/50', freq: 'BID', time: '8-8', type: 'pill' }
        ],
        history: [
            { date: 'Dec 02, 2024', title: 'Pulmonology', type: 'Routine', description: 'Spirometry FEV1 75% predicted.' }
        ],
        insurance: { provider: 'BlueCross', policy: '#BC-662-11' },
        aiSummary: "Asthma control improved with current biologic add-on. Continue monitoring."
    },
    {
        id: "#AH-1018",
        name: "Charles Dubois",
        age: 82,
        gender: "Male",
        initials: "CD",
        lastVisit: "2024-10-18",
        condition: "Congestive Heart Failure",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(85, 110),
        medications: [
            { name: 'Entresto', dosage: '49/51', freq: 'BID', time: '8-8', type: 'pill' }
        ],
        history: [
            { date: 'Oct 18, 2024', title: 'Cardiology', type: 'Visit', description: 'Edema present 2+. Lasix increased.' }
        ],
        insurance: { provider: 'Medicare', policy: '#MC-118-99' },
        aiSummary: "Fluid overload risk high. Daily weight monitoring essential. BNP elevated."
    },
    {
        id: "#AH-1019",
        name: "Yuki Taniguchi",
        age: 25,
        gender: "Female",
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-11-30",
        condition: "Epilepsy",
        risk: "Low Risk",
        riskColor: "secondary",
        active: false,
        vitals: generateVitals(68, 115),
        medications: [
            { name: 'Lamotrigine', dosage: '100mg', freq: 'BID', time: '8-8', type: 'pill' }
        ],
        history: [
            { date: 'Nov 30, 2024', title: 'Neurology', type: 'Routine', description: 'Seizure-free for 6 months.' }
        ],
        insurance: { provider: 'Cigna', policy: '#CG-221-88' },
        aiSummary: "Good seizure control. Driving restrictions currently lifted."
    },
    {
        id: "#AH-1020",
        name: "Samuel Adeyemi",
        age: 44,
        gender: "Male",
        image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&h=100",
        lastVisit: "2024-09-12",
        condition: "Liver Cirrhosis",
        risk: "High Risk",
        riskColor: "accent",
        active: true,
        vitals: generateVitals(78, 125),
        medications: [
            { name: 'Spironolactone', dosage: '100mg', freq: 'Daily', time: '08:00 AM', type: 'pill' }
        ],
        history: [
            { date: 'Sep 12, 2024', title: 'Hepatology', type: 'Visit', description: 'MELD score calculation. Evaluating for list.' }
        ],
        insurance: { provider: 'UnitedHealthcare', policy: '#UH-551-22' },
        aiSummary: "Advanced liver disease. Ascites management challenging. Close monitoring of renal function required."
    }
];

// ─── Mock Diagnostic Cases ──────────────────────────────────────────────────

const NOW = Date.now();
const HOUR = 3600000;

export const MOCK_DIAGNOSTIC_CASES: DiagCase[] = [
    {
        id: 'DC-001',
        patientId: '#AH-1001',
        patientName: 'Eleanor Voss',
        scanType: 'Chest X-Ray',
        status: 'Critical',
        time: '08:42 AM',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80',
        totalSlices: 1,
        confidence: 94.2,
        modelName: 'CheXAgent v2.1',
        findings: [
            { severity: 'critical', title: 'Bilateral pleural effusion', description: 'Moderate fluid accumulation in both pleural spaces, more prominent on the right.' },
            { severity: 'info', title: 'Cardiomegaly', description: 'Cardiothoracic ratio 0.58, consistent with known atrial fibrillation history.' }
        ],
        diagnosis: [
            { label: 'Pleural Effusion', val: 94, color: '#FE5796' },
            { label: 'Cardiomegaly', val: 87, color: '#F59E0B' },
            { label: 'Pulmonary Edema', val: 62, color: '#54E097' }
        ],
        annotations: [
            { type: 'box', top: '35%', left: '15%', width: '30%', height: '25%', label: 'R. Pleural Effusion', confidence: 94, severity: 'critical' },
            { type: 'box', top: '40%', left: '55%', width: '28%', height: '22%', label: 'L. Pleural Effusion', confidence: 89, severity: 'critical' },
            { type: 'point', top: '30%', left: '45%', label: 'Enlarged cardiac silhouette', confidence: 87, severity: 'info', lineX2: '50%', lineY2: '45%' }
        ],
        aiSummary: 'CheXAgent detected bilateral pleural effusion with high confidence (94.2%). Cardiomegaly noted, consistent with patient history of atrial fibrillation. Recommend urgent echocardiography and thoracentesis evaluation.',
        timestamp: NOW - HOUR * 2
    },
    {
        id: 'DC-002',
        patientId: '#AH-1004',
        patientName: 'James Whitfield',
        scanType: 'CT Thorax',
        status: 'Ready',
        time: '09:15 AM',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
        totalSlices: 128,
        confidence: 91.7,
        modelName: 'MedGemma-27b',
        findings: [
            { severity: 'critical', title: 'Emphysematous changes', description: 'Extensive bullous emphysema involving upper lobes bilaterally, consistent with COPD Stage III.' },
            { severity: 'info', title: 'Bronchial wall thickening', description: 'Diffuse bronchial wall thickening suggesting chronic bronchitis component.' }
        ],
        diagnosis: [
            { label: 'Emphysema', val: 92, color: '#FE5796' },
            { label: 'Chronic Bronchitis', val: 78, color: '#F59E0B' },
            { label: 'Pneumothorax', val: 12, color: '#54E097' }
        ],
        annotations: [
            { type: 'box', top: '20%', left: '20%', width: '25%', height: '20%', label: 'R. Upper Lobe Bullae', confidence: 92, severity: 'critical' },
            { type: 'box', top: '22%', left: '55%', width: '23%', height: '18%', label: 'L. Upper Lobe Bullae', confidence: 89, severity: 'critical' }
        ],
        aiSummary: 'CT confirms advanced emphysematous changes consistent with COPD Stage III. Bullous disease predominates in upper lobes. No acute pneumothorax identified. Bronchial wall thickening suggests chronic bronchitis overlap.',
        timestamp: NOW - HOUR * 3
    },
    {
        id: 'DC-003',
        patientId: '#AH-1007',
        patientName: 'Priya Sharma',
        scanType: 'Breast MRI',
        status: 'In Progress',
        time: '10:30 AM',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
        totalSlices: 256,
        confidence: 88.5,
        modelName: 'MedSigLIP v1',
        findings: [
            { severity: 'info', title: 'Post-surgical changes', description: 'Expected post-lumpectomy changes in right breast upper outer quadrant.' },
            { severity: 'info', title: 'No suspicious enhancement', description: 'No new areas of abnormal enhancement identified on dynamic sequences.' }
        ],
        diagnosis: [
            { label: 'Post-Surgical', val: 95, color: '#54E097' },
            { label: 'Recurrence', val: 8, color: '#FE5796' },
            { label: 'Benign Cyst', val: 15, color: '#F59E0B' }
        ],
        annotations: [
            { type: 'box', top: '30%', left: '60%', width: '20%', height: '15%', label: 'Surgical site', confidence: 95, severity: 'info' }
        ],
        aiSummary: 'Post-treatment surveillance MRI shows expected surgical changes. No suspicious enhancement or mass lesion to suggest recurrence. BI-RADS 2 - Benign.',
        progress: 72,
        timestamp: NOW - HOUR * 1.5
    },
    {
        id: 'DC-004',
        patientId: '#AH-1006',
        patientName: 'Robert Tanaka',
        scanType: 'Echocardiogram',
        status: 'Ready',
        time: '11:05 AM',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        totalSlices: 1,
        confidence: 96.1,
        modelName: 'MedGemma-27b',
        findings: [
            { severity: 'critical', title: 'Reduced ejection fraction', description: 'LVEF estimated at 42%, reduced from previous 45%. Mild global hypokinesis.' },
            { severity: 'info', title: 'Stent patency confirmed', description: 'LAD stent appears patent with no evidence of in-stent restenosis on color Doppler.' }
        ],
        diagnosis: [
            { label: 'Reduced EF', val: 96, color: '#FE5796' },
            { label: 'Hypokinesis', val: 82, color: '#F59E0B' },
            { label: 'Valve Disease', val: 18, color: '#54E097' }
        ],
        annotations: [
            { type: 'point', top: '45%', left: '40%', label: 'LV - EF 42%', confidence: 96, severity: 'critical', lineX2: '55%', lineY2: '50%' }
        ],
        aiSummary: 'Echocardiogram reveals progressive decline in LVEF (42%, previously 45%). Post-MI recovery complicated by mild global hypokinesis. Stent remains patent. Consider up-titration of heart failure medications.',
        timestamp: NOW - HOUR * 4
    },
    {
        id: 'DC-005',
        patientId: '#AH-1018',
        patientName: 'Charles Dubois',
        scanType: 'Chest X-Ray',
        status: 'Critical',
        time: '07:30 AM',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80',
        totalSlices: 1,
        confidence: 97.3,
        modelName: 'CheXAgent v2.1',
        findings: [
            { severity: 'critical', title: 'Pulmonary congestion', description: 'Cephalization of pulmonary vessels and bilateral perihilar haziness consistent with acute decompensated heart failure.' },
            { severity: 'critical', title: 'Bilateral pleural effusion', description: 'Small bilateral pleural effusions, right greater than left.' }
        ],
        diagnosis: [
            { label: 'Pulmonary Congestion', val: 97, color: '#FE5796' },
            { label: 'Pleural Effusion', val: 91, color: '#F59E0B' },
            { label: 'Pneumonia', val: 22, color: '#54E097' }
        ],
        annotations: [
            { type: 'box', top: '25%', left: '25%', width: '50%', height: '30%', label: 'Perihilar congestion', confidence: 97, severity: 'critical' },
            { type: 'box', top: '60%', left: '15%', width: '25%', height: '15%', label: 'R. Effusion', confidence: 91, severity: 'critical' }
        ],
        aiSummary: 'Chest X-ray demonstrates classic findings of acute decompensated heart failure: pulmonary venous congestion with cephalization and bilateral pleural effusions. BNP correlation recommended. Urgent diuretic adjustment advised.',
        timestamp: NOW - HOUR * 5
    },
    {
        id: 'DC-006',
        patientId: '#AH-1016',
        patientName: 'Benjamin Cruz',
        scanType: 'Brain MRI',
        status: 'Pending',
        time: '12:00 PM',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80',
        totalSlices: 192,
        confidence: 0,
        modelName: 'MedGemma-27b',
        findings: [],
        diagnosis: [],
        annotations: [],
        aiSummary: '',
        progress: 0,
        timestamp: NOW - HOUR * 0.5
    }
];

// ─── Mock Workflow Cards ────────────────────────────────────────────────────

export const MOCK_WORKFLOW_CARDS: WorkflowCard[] = [
    {
        id: 'WF-001',
        patientId: '#AH-1001',
        patientName: 'Eleanor Voss',
        age: 67,
        gender: 'Female',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100',
        priority: 'critical',
        scanType: 'Chest X-Ray',
        aiProgress: 100,
        column: 'consultation',
        time: '8:42 AM',
        doctor: 'Dr. Reyes',
        note: 'Bilateral pleural effusion confirmed. Awaiting cardiology consult for thoracentesis decision.',
        tags: ['Cardiology', 'Urgent'],
        aiRecommendations: [
            { icon: 'alert', title: 'Urgent Thoracentesis', description: 'Moderate-to-large bilateral effusion. Diagnostic and therapeutic thoracentesis recommended.', actionLabel: 'Schedule', actionColor: 'bg-accent' },
            { icon: 'file', title: 'Echocardiogram', description: 'Assess cardiac function given known AFib and new effusions.', actionLabel: 'Order', actionColor: 'bg-primary' }
        ],
        nextSteps: [
            { icon: 'stethoscope', title: 'Cardiology Consult', subtitle: 'Dr. Reyes reviewing', color: 'text-purple-500' },
            { icon: 'clipboard', title: 'Thoracentesis Decision', subtitle: 'Pending consult outcome', color: 'text-cyan' }
        ]
    },
    {
        id: 'WF-002',
        patientId: '#AH-1018',
        patientName: 'Charles Dubois',
        age: 82,
        gender: 'Male',
        initials: 'CD',
        priority: 'critical',
        scanType: 'Chest X-Ray',
        aiProgress: 100,
        column: 'treatment',
        time: '7:30 AM',
        doctor: 'Dr. Okafor',
        note: 'Acute decompensated CHF. IV Lasix 80mg initiated. Daily weight monitoring ordered.',
        tags: ['Cardiology', 'ICU'],
        aiRecommendations: [
            { icon: 'alert', title: 'Fluid Restriction', description: 'Limit to 1.5L/day. Monitor I/O strictly.', actionLabel: 'Confirm', actionColor: 'bg-accent' }
        ],
        nextSteps: [
            { icon: 'stethoscope', title: 'Repeat CXR in 24h', subtitle: 'Assess diuretic response', color: 'text-accent' }
        ]
    },
    {
        id: 'WF-003',
        patientId: '#AH-1006',
        patientName: 'Robert Tanaka',
        age: 55,
        gender: 'Male',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100',
        priority: 'urgent',
        scanType: 'Echocardiogram',
        aiProgress: 100,
        column: 'analysis',
        time: '11:05 AM',
        doctor: 'Dr. Chen',
        tags: ['Cardiology', 'Post-MI'],
        aiRecommendations: [
            { icon: 'stethoscope', title: 'HF Med Adjustment', description: 'EF decline from 45% to 42%. Consider sacubitril/valsartan initiation.', actionLabel: 'Review', actionColor: 'bg-primary' },
            { icon: 'file', title: 'Cardiac Rehab', description: 'Eligible for Phase II cardiac rehabilitation program.', actionLabel: 'Refer', actionColor: 'bg-secondary' }
        ]
    },
    {
        id: 'WF-004',
        patientId: '#AH-1004',
        patientName: 'James Whitfield',
        age: 72,
        gender: 'Male',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100',
        priority: 'urgent',
        scanType: 'CT Thorax',
        aiProgress: 100,
        column: 'consultation',
        time: '9:15 AM',
        doctor: 'Dr. Patel',
        note: 'Progressive emphysema. Pulmonology reviewing for oxygen therapy escalation.',
        tags: ['Pulmonology', 'COPD'],
        aiRecommendations: [
            { icon: 'alert', title: 'Home O2 Reassessment', description: 'SpO2 <88% on exertion. Continuous home oxygen may be indicated.', actionLabel: 'Evaluate', actionColor: 'bg-accent' }
        ]
    },
    {
        id: 'WF-005',
        patientId: '#AH-1007',
        patientName: 'Priya Sharma',
        age: 41,
        gender: 'Female',
        initials: 'PS',
        priority: 'stable',
        scanType: 'Breast MRI',
        aiProgress: 72,
        column: 'analysis',
        time: '10:30 AM',
        tags: ['Oncology', 'Surveillance'],
        aiRecommendations: [
            { icon: 'file', title: 'MRI Analysis In Progress', description: 'MedSigLIP processing 256 slices. Preliminary findings benign.', actionLabel: 'View', actionColor: 'bg-primary' }
        ]
    },
    {
        id: 'WF-006',
        patientId: '#AH-1016',
        patientName: 'Benjamin Cruz',
        age: 69,
        gender: 'Male',
        avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&h=100',
        priority: 'stable',
        scanType: 'Brain MRI',
        column: 'pending',
        time: '12:00 PM',
        tags: ['Neurology', 'Parkinsons']
    },
    {
        id: 'WF-007',
        patientId: '#AH-1020',
        patientName: 'Samuel Adeyemi',
        age: 44,
        gender: 'Male',
        avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&h=100',
        priority: 'critical',
        scanType: 'Abdominal Ultrasound',
        aiProgress: 100,
        column: 'treatment',
        time: '6:45 AM',
        doctor: 'Dr. Nguyen',
        note: 'Increasing ascites. Paracentesis scheduled for today. MELD score recalculation pending.',
        tags: ['Hepatology', 'Transplant'],
        aiRecommendations: [
            { icon: 'alert', title: 'Paracentesis', description: 'Large-volume paracentesis indicated. Albumin infusion post-procedure.', actionLabel: 'Schedule', actionColor: 'bg-accent' },
            { icon: 'stethoscope', title: 'MELD Recalculation', description: 'INR and creatinine trending up. Transplant list reassessment needed.', actionLabel: 'Calculate', actionColor: 'bg-primary' }
        ]
    },
    {
        id: 'WF-008',
        patientId: '#AH-1003',
        patientName: 'Aisha Okonkwo',
        age: 34,
        gender: 'Female',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&h=100',
        priority: 'follow-up',
        scanType: 'Obstetric Ultrasound',
        column: 'pending',
        time: '1:30 PM',
        tags: ['OB/GYN', 'High-Risk'],
        aiRecommendations: [
            { icon: 'file', title: 'Growth Scan', description: 'Scheduled 28-week growth scan to reassess fetal development trajectory.', actionLabel: 'Confirm', actionColor: 'bg-secondary' }
        ]
    }
];

// ─── Mock Notifications ─────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'NOTIF-001',
        type: 'critical',
        title: 'Critical Alert: Eleanor Voss (#AH-1001)',
        content: 'CheXAgent detected bilateral pleural effusion with 94.2% confidence. Immediate cardiology review recommended. Risk if ignored: +28%.',
        time: '2 hours ago',
        timestamp: NOW - HOUR * 2,
        read: false,
        action: { label: 'View Patient' },
        dismissible: false
    },
    {
        id: 'NOTIF-002',
        type: 'critical',
        title: 'CHF Decompensation: Charles Dubois (#AH-1018)',
        content: 'Chest X-ray shows acute pulmonary congestion. BNP elevated at 1,240 pg/mL. IV diuretics initiated. ICU transfer may be needed.',
        time: '5 hours ago',
        timestamp: NOW - HOUR * 5,
        read: false,
        action: { label: 'Review Case' },
        dismissible: false
    },
    {
        id: 'NOTIF-003',
        type: 'task',
        title: 'Echocardiogram Report Ready',
        content: 'Robert Tanaka\'s echocardiogram has been analyzed by MedGemma-27b. LVEF 42% — declining from baseline. Action required: medication adjustment review.',
        time: '4 hours ago',
        timestamp: NOW - HOUR * 4,
        read: false,
        action: { label: 'View Report' },
        dismissible: true
    },
    {
        id: 'NOTIF-004',
        type: 'consult',
        title: 'Pulmonology Consult Requested',
        content: 'James Whitfield requires pulmonology consult for home oxygen therapy assessment. CT thorax shows progressive emphysematous changes.',
        time: '3 hours ago',
        timestamp: NOW - HOUR * 3,
        read: false,
        action: { label: 'Accept Consult' },
        dismissible: true
    },
    {
        id: 'NOTIF-005',
        type: 'system',
        title: 'MedGemma Model Update',
        content: 'MedGemma-27b has been updated to v2.4.1 with improved cardiac imaging analysis. CheXAgent confidence scores may show slight variations.',
        time: '6 hours ago',
        timestamp: NOW - HOUR * 6,
        read: true,
        action: { label: 'View Changelog', secondary: true },
        dismissible: true
    },
    {
        id: 'NOTIF-006',
        type: 'task',
        title: 'Priya Sharma MRI — Analysis In Progress',
        content: 'Breast MRI for Priya Sharma (#AH-1007) is 72% complete. MedSigLIP processing 256 slices. Preliminary findings suggest post-surgical changes only.',
        time: '90 minutes ago',
        timestamp: NOW - HOUR * 1.5,
        read: true,
        dismissible: true
    },
    {
        id: 'NOTIF-007',
        type: 'critical',
        title: 'Liver Function Deterioration: Samuel Adeyemi',
        content: 'MELD score increased from 18 to 22 over the past 72 hours. INR 1.8, Creatinine 1.6. Transplant list reassessment recommended.',
        time: '8 hours ago',
        timestamp: NOW - HOUR * 8,
        read: false,
        action: { label: 'View Labs' },
        dismissible: false
    },
    {
        id: 'NOTIF-008',
        type: 'consult',
        title: 'Neurology Follow-Up Due',
        content: 'Benjamin Cruz (#AH-1016) has a scheduled neurology follow-up for Parkinson\'s tremor assessment. Brain MRI pending review.',
        time: '30 minutes ago',
        timestamp: NOW - HOUR * 0.5,
        read: false,
        action: { label: 'View Schedule' },
        dismissible: true
    },
    {
        id: 'NOTIF-009',
        type: 'system',
        title: 'Daily Clinical Summary Generated',
        content: 'Today\'s AI-generated clinical summary is ready. 8 active patients monitored, 3 escalations flagged, 2 new diagnostic reports available.',
        time: '1 hour ago',
        timestamp: NOW - HOUR * 1,
        read: true,
        action: { label: 'View Summary', secondary: true },
        dismissible: true
    },
    {
        id: 'NOTIF-010',
        type: 'task',
        title: 'Medication Review: Marcus Chen',
        content: 'A1C remains elevated at 8.2%. MedGemma recommends reviewing metformin dosage and considering SGLT2 inhibitor addition for cardiorenal protection.',
        time: '10 hours ago',
        timestamp: NOW - HOUR * 10,
        read: true,
        action: { label: 'Review Plan' },
        dismissible: true
    },
    {
        id: 'NOTIF-011',
        type: 'consult',
        title: 'Oncology Consult: Priya Sharma',
        content: 'Follow-up with oncology for adjuvant therapy discussion. MRI results pending — preliminary scan appears clear.',
        time: '12 hours ago',
        timestamp: NOW - HOUR * 12,
        read: true,
        action: { label: 'View Notes', secondary: true },
        dismissible: true
    },
    {
        id: 'NOTIF-012',
        type: 'system',
        title: 'Agentic Surveillance Cycle Complete',
        content: 'Background surveillance cycle #1847 completed. All IoT vital streams within acceptable baselines. No new escalations triggered.',
        time: '15 minutes ago',
        timestamp: NOW - HOUR * 0.25,
        read: true,
        dismissible: true
    }
];

// ─── Seed Function ──────────────────────────────────────────────────────────

export async function seedDatabase() {
    await db.transaction('rw', db.patients, db.diagnosticCases, db.workflowCards, db.notifications, async () => {
        // Clear existing
        await Promise.all([
            db.patients.clear(),
            db.diagnosticCases.clear(),
            db.workflowCards.clear(),
            db.notifications.clear()
        ]);

        // Seed patients (with risk reset for AI to re-evaluate)
        const cleanPatients: Patient[] = MOCK_PATIENTS.map(p => ({
            ...p,
            aiSummary: "",
            risk: "Unknown",
            riskColor: "secondary"
        }));
        await db.patients.bulkAdd(cleanPatients);

        // Seed diagnostic cases
        await db.diagnosticCases.bulkAdd(MOCK_DIAGNOSTIC_CASES);

        // Seed workflow cards
        await db.workflowCards.bulkAdd(MOCK_WORKFLOW_CARDS);

        // Seed notifications
        await db.notifications.bulkAdd(MOCK_NOTIFICATIONS);
    });
}

