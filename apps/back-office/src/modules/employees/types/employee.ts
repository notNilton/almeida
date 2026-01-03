export interface Employee {
    id: number;
    name: string;
    cpf: string;
    registration?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
    contracts?: Contract[];
    documents?: any[];
}

export interface Contract {
    id: number;
    employeeId: number;
    type: string;
    startDate: string;
    endDate?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
