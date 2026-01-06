export interface Employee {
    id: string; // Changed from number to string
    name: string;
    cpf: string;
    registration?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
    contracts?: Contract[];
    documents?: Document[];
}

export interface Document {
    id: string;
    name: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Contract {
    id: string; // Changed from number to string
    employeeId: string; // Changed from number to string
    type: string;
    startDate: string;
    endDate?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
