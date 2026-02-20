import Dexie, { Table } from 'dexie';
import { Patient, DiagCase, WorkflowCard, NotificationItem, AppSettings, User } from './types';

export class AuraDatabase extends Dexie {
    patients!: Table<Patient>;
    diagnosticCases!: Table<DiagCase>;
    workflowCards!: Table<WorkflowCard>;
    notifications!: Table<NotificationItem>;
    appSettings!: Table<AppSettings>;
    users!: Table<User>;

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
            users: 'id, email'
        });
    }
}

export const db = new AuraDatabase();
