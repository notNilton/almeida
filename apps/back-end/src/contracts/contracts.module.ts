import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { AuditLogModule } from '../audit/audit-log.module';

@Module({
    imports: [AuditLogModule],
    providers: [ContractsService],
    controllers: [ContractsController],
    exports: [ContractsService],
})
export class ContractsModule { }
