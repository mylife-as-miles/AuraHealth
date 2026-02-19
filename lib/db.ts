import Dexie, { Table } from 'dexie';
import { Patient, DiagCase, WorkflowCard, NotificationItem, AppSettings, UserSettings } from './types';

export class AuraDatabase extends Dexie {
    patients!: Table<Patient>;
    diagnosticCases!: Table<DiagCase>;
    workflowCards!: Table<WorkflowCard>;
    notifications!: Table<NotificationItem>;
    appSettings!: Table<AppSettings>;
    userSettings!: Table<UserSettings>;

    constructor() {
        super('AuraHealthDB');

        this.version(1).stores({
            patients: 'id, name, risk, condition', // Primary key and indexed props
            diagnosticCases: 'id, patientId, status, time',
            workflowCards: 'id, patientId, column, priority',
            notifications: 'id, type, read, timestamp',
            appSettings: 'id'
        });

        this.version(2).stores({
            patients: 'id, name, risk, condition',
            diagnosticCases: 'id, patientId, status, time',
            workflowCards: 'id, patientId, column, priority',
            notifications: 'id, type, read, timestamp',
            appSettings: 'id',
            userSettings: 'id, updatedAt'
        });
    }
}

export const db = new AuraDatabase();
