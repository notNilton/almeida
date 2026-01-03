import { Injectable } from '@nestjs/common';
import { StorageProvider } from './storage.provider';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class DiskStorageProvider implements StorageProvider {
    private readonly uploadPath = './uploads';

    async upload(file: Express.Multer.File): Promise<string> {
        // Multer diskStorage already handles the initial save in the controller's interceptor
        // but we can move logic here if we refactor Multer to memoryStorage later.
        // For now, we assume the file is already at file.path
        return file.filename;
    }

    async delete(filename: string): Promise<void> {
        try {
            await fs.unlink(join(this.uploadPath, filename));
        } catch (error) {
            console.error(`Failed to delete file: ${filename}`, error);
        }
    }

    getUrl(filename: string): string {
        const baseUrl = process.env.API_URL || 'http://localhost:3000';
        return `${baseUrl}/public/${filename}`;
    }
}
