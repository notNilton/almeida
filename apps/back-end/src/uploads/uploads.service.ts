import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
    constructor(private readonly prisma: PrismaService) { }

    generateFileName(originalName: string): string {
        const hash = randomBytes(16).toString('hex');
        const extension = extname(originalName);
        return `${hash}${extension}`;
    }

    getFileUrl(fileName: string, req: any): string {
        const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
        return `${baseUrl}/public/${fileName}`;
    }

    async saveUploadMetadata(filename: string, originalName: string, mimetype: string, size: number, req: any) {
        const url = this.getFileUrl(filename, req);
        return this.prisma.upload.create({
            data: {
                filename,
                originalName,
                mimetype,
                size,
                url,
            },
        });
    }
}
