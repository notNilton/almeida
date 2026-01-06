import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from '../common/utils/nanoid';
import type { StorageProvider } from './providers/storage.provider';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('STORAGE_PROVIDER')
    private readonly storageProvider: StorageProvider,
  ) {}

  async saveUploadMetadata(
    filename: string,
    originalName: string,
    mimetype: string,
    size: number,
  ) {
    const url = this.storageProvider.getUrl(filename);
    const id = nanoid();
    return this.prisma.upload.create({
      data: {
        id,
        filename,
        originalName,
        mimetype,
        size,
        url,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.upload.findUnique({ where: { id } });
  }

  async delete(id: string) {
    const upload = await this.findById(id);
    if (upload) {
      await this.storageProvider.delete(upload.filename);
      await this.prisma.upload.delete({ where: { id } });
    }
    return upload;
  }
}
