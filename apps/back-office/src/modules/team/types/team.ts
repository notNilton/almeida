import type { Upload } from "../../../types/upload";

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    email?: string;
    imageId?: number;
    image?: Upload;
    status: string;
}
