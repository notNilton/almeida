import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { DocumentStatus } from '@prisma/client';
import { nanoid } from '../common/utils/nanoid';

@Injectable()
export class DocumentsService {
    constructor(
        private prisma: PrismaService,
        private auditLog: AuditLogService,
    ) { }

    async findAll() {
        return await this.prisma.document.findMany({
            include: {
                upload: true,
                employee: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByEmployee(employeeId: string) {
        return this.prisma.document.findMany({
            where: { employeeId },
            include: { upload: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: any, adminUserId: string) {
        const { uploadId, employeeId, ...rest } = data;
        const id = nanoid();
        const document = await this.prisma.document.create({
            data: {
                id,
                ...rest,
                status: data.status || DocumentStatus.PENDING,
                upload: { connect: { id: uploadId } },
                employee: employeeId ? { connect: { id: employeeId } } : undefined,
            },
            include: { upload: true, employee: true },
        });
        await this.auditLog.log(adminUserId, 'CREATE', 'Document', document.id, data);
        return document;
    }

    async update(id: string, data: any, adminUserId: string) {
        const { uploadId, employeeId, ...rest } = data;
        const updateData: any = { ...rest };

        if (uploadId) updateData.upload = { connect: { id: uploadId } };
        if (employeeId) updateData.employee = { connect: { id: employeeId } };

        const document = await this.prisma.document.update({
            where: { id },
            data: updateData,
            include: { upload: true, employee: true },
        });
        await this.auditLog.log(adminUserId, 'UPDATE', 'Document', id, data);
        return document;
    }

    async remove(id: string, adminUserId: string) {
        await this.auditLog.log(adminUserId, 'DELETE', 'Document', id);
        return this.prisma.document.delete({ where: { id } });
    }

    async processOcr(id: string, ocrData: any) {
        return this.prisma.document.update({
            where: { id },
            data: {
                ocrData,
                status: DocumentStatus.PROCESSED,
            },
        });
    }
}
