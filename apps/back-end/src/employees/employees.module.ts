import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { AuditLogModule } from '../audit/audit-log.module';

@Module({
    imports: [AuditLogModule],
    providers: [EmployeesService],
    controllers: [EmployeesController],
    exports: [EmployeesService],
})
export class EmployeesModule { }
