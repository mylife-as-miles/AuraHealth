export interface VitalsData {
    time: string;
    hr: number;
    sys: number;
    dia: number;
    temp: number;
    weight: number;
}

export interface Medication {
    name: string;
    dosage: string;
    freq: string;
    time: string;
    type: 'pill' | 'injection';
}

export interface TimelineEvent {
    date: string;
    title: string;
    type: 'Diagnosis' | 'Visit' | 'Routine';
    description: string;
}

export interface Patient {
    id: string; // e.g. #AH-8832
    name: string;
    age: number;
    gender: string;
    image?: string;
    initials?: string;
    lastVisit: string;
    condition: string; // Primary condition for display
    risk: 'High Risk' | 'Moderate' | 'Low Risk';
    riskColor: 'accent' | 'yellow' | 'secondary';
    active: boolean; // Currently admitted/active case?
    vitals: VitalsData[];
    medications: Medication[];
    history: TimelineEvent[];
    insurance: { provider: string; policy: string };
    aiSummary: string;
}

// Diagnostics
export interface Finding {
    severity: 'critical' | 'info';
    title: string;
    description: string;
}

export interface Diagnosis {
    label: string;
    val: number;
    color: string;
}

export interface Annotation {
    type: 'box' | 'point';
    top: string;
    left: string;
    width?: string;
    height?: string;
    label: string;
    confidence: number;
    severity: 'critical' | 'info';
    lineX2?: string;
    lineY2?: string;
}

export interface DiagCase {
    id: string;
    patientId: string; // Link to Patient.id
    patientName: string; // Denormalized for easy display
    scanType: string;
    status: 'Critical' | 'Ready' | 'In Progress' | 'Pending';
    time: string;
    image: string;
    totalSlices: number;
    confidence: number;
    modelName: string;
    findings: Finding[];
    diagnosis: Diagnosis[];
    annotations: Annotation[];
    aiSummary: string;
    progress?: number;
    timestamp: number; // For sorting
}

// Clinical Workflow
export type Priority = 'critical' | 'urgent' | 'stable' | 'follow-up';
export type ColumnId = 'pending' | 'analysis' | 'consultation' | 'treatment';

export interface WorkflowCard {
    id: string;
    patientId: string; // Link to Patient.id
    patientName: string;
    age: number;
    gender: string;
    avatar?: string;
    initials?: string;
    priority: Priority;
    scanType: string;
    scanImage?: string;
    aiProgress?: number;
    column: ColumnId;
    time: string;
    doctor?: string;
    note?: string;
    tags?: string[];
    aiRecommendations?: {
        icon: 'alert' | 'file' | 'stethoscope';
        title: string;
        description: string;
        actionLabel: string;
        actionColor: string;
    }[];
    nextSteps?: {
        icon: 'stethoscope' | 'clipboard';
        title: string;
        subtitle: string;
        color: string;
    }[];
}

// Notifications
export interface NotificationItem {
    id: string;
    type: 'critical' | 'task' | 'system' | 'consult';
    title: string;
    content: string;
    time: string;
    timestamp: number; // Date.now()
    read: boolean;
    action?: { label: string; secondary?: boolean };
    dismissible?: boolean;
}

// App Settings & Meta
export interface AppSettings {
    id: string; // Singleton 'settings'
    onboardingComplete: boolean;
    theme: 'light' | 'dark';
    lastSeedDate?: number;
}
