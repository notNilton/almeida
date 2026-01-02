import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.document.findMany({
            include: { upload: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: any) {
        const { uploadId, ...rest } = data;
        return this.prisma.document.create({
            data: {
                ...rest,
                upload: uploadId ? { connect: { id: Number(uploadId) } } : undefined,
            }
        });
    }

    async update(id: number, data: any) {
        const { uploadId, ...rest } = data;
        return this.prisma.document.update({
            where: { id },
            data: {
                ...rest,
                upload: uploadId ? { connect: { id: Number(uploadId) } } : undefined,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.document.delete({ where: { id } });
    }
}
