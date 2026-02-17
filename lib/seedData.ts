import { Patient, DiagCase, WorkflowCard, NotificationItem, AppSettings } from './types';
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

// Mock data for other tables removed as per user request (patients only)

export async function seedDatabase() {
    await db.transaction('rw', db.patients, db.diagnosticCases, db.workflowCards, db.notifications, async () => {
        // Clear existing
        await Promise.all([
            db.patients.clear(),
            db.diagnosticCases.clear(),
            db.workflowCards.clear(),
            db.notifications.clear()
        ]);

        // Add mock data (Patients ONLY, no pre-calculated AI insights)
        const cleanPatients = MOCK_PATIENTS.map(p => ({
            ...p,
            aiSummary: "", // Clear AI summary
            risk: "Unknown", // Reset risk to be determined
            riskColor: "secondary" // Neutral color
        }));

        await db.patients.bulkAdd(cleanPatients);
    });
}
