import type { Upload } from "../../../types/upload";

export interface Project {
    id: number;
    title: string;
    description: string;
    fullDescription: string;
    category: string;
    imageId?: number;
    image?: Upload;
    date?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    publishedAt?: string;
    seoTitle?: string;
    seoDescription?: string;
    views: number;
}
