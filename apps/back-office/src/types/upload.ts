export interface Upload {
    id: string; // Changed from number to string
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    createdAt: string;
}
