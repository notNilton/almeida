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
                forcePasswordChange: true,
                createdAt: true,
            },
        });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                avatar: true,
            },
        });
    }

    async update(id: number, data: any, adminUserId?: number) {
        const { avatarId, password, ...rest } = data;

        const updateData: any = { ...rest };

        if (avatarId) {
            updateData.avatar = { connect: { id: Number(avatarId) } };
        } else if (avatarId === null) {
            updateData.avatar = { disconnect: true };
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: { avatar: true },
        });

        if (adminUserId) {
            await this.auditLog.log(adminUserId, 'UPDATE_USER', 'User', id, rest);
        }

        return updated;
    }

    async remove(id: number, adminUserId: number, deleteCode: string) {
        const masterHash = process.env.MASTER_DELETE_CODE_HASH;
        if (!masterHash) {
            throw new Error('MASTER_DELETE_CODE_HASH not configured in environment.');
        }

        const isValid = await bcrypt.compare(deleteCode, masterHash);
        if (!isValid) {
            throw new Error('Código mestre de exclusão incorreto.');
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
                forcePasswordChange: true,
            },
        });

        await this.auditLog.log(adminUserId, 'CREATE_USER', 'User', user.id, rest);

        return user;
    }
}
