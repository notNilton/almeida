import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
    constructor(private prisma: PrismaService) { }

    async log(userId: number, action: string, entityType: string, entityId: number, payload?: any) {
        return this.prisma.auditLog.create({
            data: {
                userId,
                action,
                entityType,
                entityId,
                payload: payload ? JSON.stringify(payload) : null,
            },
        });
    }

    async findAll() {
        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
