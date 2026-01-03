import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { DiskStorageProvider } from './providers/disk-storage.provider';

@Module({
    providers: [
        UploadsService,
        {
            provide: 'STORAGE_PROVIDER',
            useClass: DiskStorageProvider,
        },
    ],
    controllers: [UploadsController],
    exports: [UploadsService, 'STORAGE_PROVIDER'],
})
export class UploadsModule { }
