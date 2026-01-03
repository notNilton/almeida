import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private auditLog: AuditLogService
    ) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: any, adminUserId?: number) {
        const { password, ...rest } = data;

        const updated = await this.prisma.user.update({
            where: { id },
            data: rest,
        });

        if (adminUserId) {
            await this.auditLog.log(adminUserId, 'UPDATE_USER', 'User', id, rest);
        }

        return updated;
    }

    async remove(id: number, adminUserId: number, deleteCode: string) {
        const masterHash = process.env.MASTER_DELETE_CODE_HASH;
        if (!masterHash) masterHash === '$2b$10$legacyhashplaceholder'; // Fallback for dev if needed

        const isValid = deleteCode === process.env.MASTER_DELETE_CODE || (masterHash && await bcrypt.compare(deleteCode, masterHash));

        if (!isValid) {
            throw new Error('Código de exclusão incorreto.');
        }

        await this.auditLog.log(adminUserId, 'DELETE_USER', 'User', id);
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async create(data: any, adminUserId: number) {
        const { password, ...rest } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...rest,
                password: hashedPassword,
            },
        });

        await this.auditLog.log(adminUserId, 'CREATE_USER', 'User', user.id, rest);

        return user;
    }
}
