import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { DocumentStatus } from '@prisma/client';

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

    async findByEmployee(employeeId: number) {
        return this.prisma.document.findMany({
            where: { employeeId },
            include: { upload: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: any, adminUserId: number) {
        const { uploadId, employeeId, ...rest } = data;
        const document = await this.prisma.document.create({
            data: {
                ...rest,
                status: data.status || DocumentStatus.PENDING,
                upload: { connect: { id: Number(uploadId) } },
                employee: employeeId ? { connect: { id: Number(employeeId) } } : undefined,
            },
            include: { upload: true, employee: true },
        });
        await this.auditLog.log(adminUserId, 'CREATE', 'Document', document.id, data);
        return document;
    }

    async update(id: number, data: any, adminUserId: number) {
        const { uploadId, employeeId, ...rest } = data;
        const updateData: any = { ...rest };

        if (uploadId) updateData.upload = { connect: { id: Number(uploadId) } };
        if (employeeId) updateData.employee = { connect: { id: Number(employeeId) } };

        const document = await this.prisma.document.update({
            where: { id },
            data: updateData,
            include: { upload: true, employee: true },
        });
        await this.auditLog.log(adminUserId, 'UPDATE', 'Document', id, data);
        return document;
    }

    async remove(id: number, adminUserId: number) {
        await this.auditLog.log(adminUserId, 'DELETE', 'Document', id);
        return this.prisma.document.delete({ where: { id } });
    }

    // Placeholder for IA OCR result processing
    async processOcr(id: number, ocrData: any) {
        return this.prisma.document.update({
            where: { id },
            data: {
                ocrData,
                status: DocumentStatus.PROCESSED,
            },
        });
    }
}
