import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { search?: string, category?: string, status?: string }) {
        const where: any = {};

        if (filters?.category && filters.category !== 'All') {
            where.category = filters.category;
        }

        if (filters?.status && filters.status !== 'All') {
            where.status = filters.status;
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { fullDescription: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return await this.prisma.project.findMany({
            where,
            include: { image: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.project.update({
            where: { id },
            data: { views: { increment: 1 } },
            include: { image: true },
        });
    }

    async create(data: any) {
        const { imageId, ...rest } = data;
        return this.prisma.project.create({
            data: {
                ...rest,
                image: imageId ? { connect: { id: Number(imageId) } } : undefined,
            }
        });
    }

    async update(id: number, data: any) {
        const { imageId, ...rest } = data;
        return this.prisma.project.update({
            where: { id },
            data: {
                ...rest,
                image: imageId ? { connect: { id: Number(imageId) } } : undefined,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.project.delete({ where: { id } });
    }
}
