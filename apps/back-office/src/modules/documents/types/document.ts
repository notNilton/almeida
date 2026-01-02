import type { Upload } from "../../../types/upload";

export interface Document {
    id: number;
    name: string;
    uploadId?: number;
    upload?: Upload;
    category: string;
    isPublic: boolean;
}
