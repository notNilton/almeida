export interface User {
    id: number;
    email: string;
    name?: string;
    role: 'ADMIN' | 'USER' | 'VIEWER';
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    avatar?: {
        id: number;
        url: string;
    } | null;
    avatarId?: number | null;
    bio?: string | null;
    createdAt: string;
}
