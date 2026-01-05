import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { EmployeeStatus } from '@prisma/client';
import { nanoid } from '../common/utils/nanoid';

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

    async findOne(id: string) {
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

    async create(data: any, adminUserId: string) {
        const id = nanoid();
        const employee = await this.prisma.employee.create({
            data: {
                id,
                name: data.name,
                cpf: data.cpf,
                registration: data.registration,
                status: data.status || EmployeeStatus.ACTIVE,
            },
        });
        await this.auditLog.log(adminUserId, 'CREATE', 'Employee', employee.id, data);
        return employee;
    }

    async update(id: string, data: any, adminUserId: string) {
        const employee = await this.prisma.employee.update({
            where: { id },
            data,
        });
        await this.auditLog.log(adminUserId, 'UPDATE', 'Employee', id, data);
        return employee;
    }

    async remove(id: string, adminUserId: string) {
        await this.auditLog.log(adminUserId, 'DELETE', 'Employee', id);
        return this.prisma.employee.delete({ where: { id } });
    }
}
