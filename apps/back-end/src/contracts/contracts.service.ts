import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { nanoid } from '../common/utils/nanoid';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async findAllByEmployee(employeeId: string) {
    return this.prisma.contract.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' },
    });
  }

  async create(data: CreateContractDto, adminUserId: string) {
    const id = nanoid();
    const contract = await this.prisma.contract.create({
      data: {
        id,
        employeeId: data.employeeId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || 'ACTIVE',
      },
    });
    await this.auditLog.log(
      adminUserId,
      'CREATE',
      'Contract',
      contract.id,
      data,
    );
    return contract;
  }

  async update(id: string, data: UpdateContractDto, adminUserId: string) {
    const updateData: Record<string, any> = { ...data };

    if (data.startDate) updateData.startDate = new Date(data.startDate);

    if (data.endDate) updateData.endDate = new Date(data.endDate);

    const contract = await this.prisma.contract.update({
      where: { id },

      data: updateData,
    });
    await this.auditLog.log(adminUserId, 'UPDATE', 'Contract', id, data);
    return contract;
  }

  async remove(id: string, adminUserId: string) {
    await this.auditLog.log(adminUserId, 'DELETE', 'Contract', id);
    return this.prisma.contract.delete({ where: { id } });
  }
}
