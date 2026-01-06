import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from '../common/utils/nanoid';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    payload?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        id: nanoid(),
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
