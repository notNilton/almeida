import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class ContractsService {
    constructor(
        private prisma: PrismaService,
        private auditLog: AuditLogService,
    ) { }

    async findAllByEmployee(employeeId: number) {
        return this.prisma.contract.findMany({
            where: { employeeId },
            orderBy: { startDate: 'desc' },
        });
    }

    async create(data: any, adminUserId: number) {
        const contract = await this.prisma.contract.create({
            data: {
                employeeId: data.employeeId,
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                status: data.status || 'ACTIVE',
            },
        });
        await this.auditLog.log(adminUserId, 'CREATE', 'Contract', contract.id, data);
        return contract;
    }

    async update(id: number, data: any, adminUserId: number) {
        const updateData = { ...data };
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);

        const contract = await this.prisma.contract.update({
            where: { id },
            data: updateData,
        });
        await this.auditLog.log(adminUserId, 'UPDATE', 'Contract', id, data);
        return contract;
    }

    async remove(id: number, adminUserId: number) {
        await this.auditLog.log(adminUserId, 'DELETE', 'Contract', id);
        return this.prisma.contract.delete({ where: { id } });
    }
}
