import type { Upload } from "../../../types/upload";

export interface User {
    id: number;
    email: string;
    name?: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
    bio?: string;
    avatarId?: number;
    avatar?: Upload;
    forcePasswordChange?: boolean;
    createdAt: string;
}
