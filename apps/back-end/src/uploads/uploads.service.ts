import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { StorageProvider } from './providers/storage.provider';

@Injectable()
export class UploadsService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('STORAGE_PROVIDER') private readonly storageProvider: StorageProvider,
    ) { }

    async saveUploadMetadata(filename: string, originalName: string, mimetype: string, size: number) {
        const url = this.storageProvider.getUrl(filename);
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

    async findById(id: number) {
        return this.prisma.upload.findUnique({ where: { id } });
    }

    async delete(id: number) {
        const upload = await this.findById(id);
        if (upload) {
            await this.storageProvider.delete(upload.filename);
            await this.prisma.upload.delete({ where: { id } });
        }
        return upload;
    }
}
