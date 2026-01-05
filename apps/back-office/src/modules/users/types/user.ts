export interface User {
    id: string; // Changed from number to string (NanoID)
    email: string;
    name?: string;
    role: 'ADMIN' | 'USER' | 'VIEWER';
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    avatar?: {
        id: string; // Changed from number to string
        url: string;
    } | null;
    avatarId?: string | null; // Changed from number to string
    bio?: string | null;
    createdAt: string;
}
