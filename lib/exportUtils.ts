import JSZip from 'jszip';
import { Patient } from './types';

// Helper function to escape CSV values correctly
const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value);
  // Escape double quotes by doubling them
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export const exportPatientRecord = async (patient: Patient) => {
  const zip = new JSZip();

  // --- 1. Generate Patient Details CSV ---
  const detailsRows = [
    ['Field', 'Value'],
    ['Patient ID', patient.id],
    ['Name', patient.name],
    ['Age', patient.age],
    ['Gender', patient.gender],
    ['Condition', patient.condition],
    ['Risk Level', patient.risk],
    ['Last Visit', patient.lastVisit],
    ['Insurance Provider', patient.insurance?.provider],
    ['Insurance Policy', patient.insurance?.policy],
    ['AI Summary', patient.aiSummary],
    ['AI Reason', patient.aiReason],
    ['Risk Percentage', patient.riskPercentage ? `${patient.riskPercentage}%` : null],
    ['Baseline Summary', patient.baselineSummary],
    ['Current Priority', patient.currentPriority],
    ['Risk If Ignored', patient.riskIfIgnored],
    ['Priority Accepted', patient.priorityAccepted ? 'Yes' : 'No'],
    ['Medical History Notes', patient.medicalHistoryNotes],
    ['Medications Notes', patient.medicationsNotes],
    ['Family History Notes', patient.familyHistoryNotes],
    ['Allergies', patient.allergies],
  ];

  // Add structured AI data if available
  if (patient.conditionInfo) {
    detailsRows.push(['--- AI Condition Info ---', '']);
    detailsRows.push(['Condition Title', patient.conditionInfo.title]);
    detailsRows.push(['Severity', patient.conditionInfo.severity]);
    detailsRows.push(['Confidence', `${patient.conditionInfo.confidence}%`]);
    detailsRows.push(['Key Indicators', patient.conditionInfo.keyIndicators?.join('; ')]);
  }

  if (patient.doctorReport) {
    detailsRows.push(['--- Doctor Report ---', '']);
    detailsRows.push(['Report Content', patient.doctorReport]);
  }

  if (patient.aiDiagnostics && patient.aiDiagnostics.length > 0) {
    detailsRows.push(['--- AI Diagnostics ---', '']);
    patient.aiDiagnostics.forEach((diag, idx) => {
      detailsRows.push([`Diagnostic ${idx + 1} Category`, diag.category]);
      detailsRows.push([`Diagnostic ${idx + 1} Status`, diag.status]);
      detailsRows.push([`Diagnostic ${idx + 1} Findings`, diag.findings?.join('; ')]);
    });
  }

  if (patient.recommendedActions && patient.recommendedActions.length > 0) {
    detailsRows.push(['--- Recommended Actions ---', '']);
    patient.recommendedActions.forEach((action, idx) => {
      detailsRows.push([`Action ${idx + 1} Type`, action.type]);
      detailsRows.push([`Action ${idx + 1} Priority`, action.priority]);
      detailsRows.push([`Action ${idx + 1} Description`, action.description]);
    });
  }

  if (patient.differentialDiagnosis && patient.differentialDiagnosis.length > 0) {
    detailsRows.push(['--- Differential Diagnosis ---', '']);
    detailsRows.push(['Diagnoses', patient.differentialDiagnosis.join('; ')]);
  }

  if (patient.clinicalPlan) {
    detailsRows.push(['--- Clinical Plan ---', '']);
    detailsRows.push(['Plan Content', patient.clinicalPlan]);
  }

  if (patient.safetyNet) {
    detailsRows.push(['--- Safety Net ---', '']);
    detailsRows.push(['Safety Net Content', patient.safetyNet]);
  }

  // Convert to CSV string using escapeCSV
  const detailsCsvContent = detailsRows
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');

  zip.file('patient_details.csv', detailsCsvContent);


  // --- 2. Generate Vitals CSV ---
  const vitalsHeaders = ['Time', 'Heart Rate', 'Systolic BP', 'Diastolic BP', 'Temperature', 'Weight'];
  const vitalsRows = patient.vitals.map(v => [
    v.time,
    v.hr,
    v.sys,
    v.dia,
    v.temp,
    v.weight
  ]);

  const vitalsCsvContent = [vitalsHeaders, ...vitalsRows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');

  zip.file('patient_vitals.csv', vitalsCsvContent);


  // --- 3. Generate Medications CSV (Optional but good to have separate) ---
  if (patient.medications && patient.medications.length > 0) {
      const medHeaders = ['Name', 'Dosage', 'Frequency', 'Time', 'Type'];
      const medRows = patient.medications.map(m => [
          m.name,
          m.dosage,
          m.freq,
          m.time,
          m.type
      ]);
      const medCsvContent = [medHeaders, ...medRows]
          .map(row => row.map(escapeCSV).join(','))
          .join('\n');
      zip.file('patient_medications.csv', medCsvContent);
  }

  // --- 4. Generate History CSV (Optional) ---
  if (patient.history && patient.history.length > 0) {
      const histHeaders = ['Date', 'Title', 'Type', 'Description'];
      const histRows = patient.history.map(h => [
          h.date,
          h.title,
          h.type,
          h.description
      ]);
      const histCsvContent = [histHeaders, ...histRows]
          .map(row => row.map(escapeCSV).join(','))
          .join('\n');
      zip.file('patient_history.csv', histCsvContent);
  }


  // --- 5. Generate Zip and Download ---
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${patient.name.replace(/ /g, '_')}_Record.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
