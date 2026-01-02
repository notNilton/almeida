import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return await this.prisma.teamMember.findMany({
            include: { image: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.teamMember.findUnique({
            where: { id },
            include: { image: true },
        });
    }

    async create(data: any) {
        const { imageId, ...rest } = data;
        return this.prisma.teamMember.create({
            data: {
                ...rest,
                image: imageId ? { connect: { id: Number(imageId) } } : undefined,
            }
        });
    }

    async update(id: number, data: any) {
        const { imageId, ...rest } = data;
        return this.prisma.teamMember.update({
            where: { id },
            data: {
                ...rest,
                image: imageId ? { connect: { id: Number(imageId) } } : undefined,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.teamMember.delete({ where: { id } });
    }
}
