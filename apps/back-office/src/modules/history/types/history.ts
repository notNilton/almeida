import type { Upload } from "../../../types/upload";

export interface HistoryEvent {
    id: number;
    year: string;
    event: string;
    type: string;
    imageId?: number;
    image?: Upload;
    date?: string;
}
