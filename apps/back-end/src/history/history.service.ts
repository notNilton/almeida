import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.historyEvent.findMany({
            include: { image: true },
            orderBy: { year: 'asc' },
        });
    }

    async create(data: any) {
        const { imageId, ...rest } = data;
        return this.prisma.historyEvent.create({
            data: {
                ...rest,
                image: imageId ? { connect: { id: Number(imageId) } } : undefined,
            }
        });
    }

    async update(id: number, data: any) {
        const { imageId, ...rest } = data;
        return this.prisma.historyEvent.update({
            where: { id },
            data: {
                ...rest,
                image: imageId ? { connect: { id: Number(imageId) } } : undefined,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.historyEvent.delete({ where: { id } });
    }
}
