import type { Upload } from "../../../types/upload";

export type DocumentType =
    | 'ACCOUNT_OPENING'
    | 'PRESENTATION_LETTER'
    | 'TRANSPORT_VOUCHER'
    | 'SUBSTITUTION_FORM'
    | 'CLOSING_COMMUNICATION'
    | 'EARLY_TERMINATION_COMMUNICATION'
    | 'RENEWAL_COMMUNICATION'
    | 'PAYSLIP'
    | 'OTHER';

export type DocumentStatus = 'PENDING' | 'PROCESSED' | 'ERROR';

export interface Document {
    id: string; // Changed from number to string
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    employeeId?: string; // Changed from number to string
    uploadId?: string; // Changed from number to string
    upload?: Upload;
    ocrData?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
