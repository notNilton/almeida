import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { EmployeeStatus } from '@prisma/client';

@Injectable()
export class EmployeesService {
    constructor(
        private prisma: PrismaService,
        private auditLog: AuditLogService,
    ) { }

    async findAll() {
        return this.prisma.employee.findMany({
            include: {
                contracts: true,
                documents: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: number) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                contracts: true,
                documents: true,
            },
        });
        if (!employee) throw new NotFoundException(`Employee with ID ${id} not found`);
        return employee;
    }

    async create(data: any, adminUserId: number) {
        const employee = await this.prisma.employee.create({
            data: {
                name: data.name,
                cpf: data.cpf,
                registration: data.registration,
                status: data.status || EmployeeStatus.ACTIVE,
            },
        });
        await this.auditLog.log(adminUserId, 'CREATE', 'Employee', employee.id, data);
        return employee;
    }

    async update(id: number, data: any, adminUserId: number) {
        const employee = await this.prisma.employee.update({
            where: { id },
            data,
        });
        await this.auditLog.log(adminUserId, 'UPDATE', 'Employee', id, data);
        return employee;
    }

    async remove(id: number, adminUserId: number) {
        await this.auditLog.log(adminUserId, 'DELETE', 'Employee', id);
        return this.prisma.employee.delete({ where: { id } });
    }
}
