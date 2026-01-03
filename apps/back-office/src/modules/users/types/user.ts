export interface User {
    id: number;
    email: string;
    name?: string;
    role: 'ADMIN' | 'USER' | 'VIEWER';
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    createdAt: string;
}
