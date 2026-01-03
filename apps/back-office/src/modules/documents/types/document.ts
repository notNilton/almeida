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
    id: number;
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    employeeId?: number;
    uploadId?: number;
    upload?: Upload;
    ocrData?: any;
    createdAt: string;
    updatedAt: string;
}
