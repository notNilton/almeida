import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('employee/:employeeId')
  @Roles(Role.ADMIN, Role.USER, Role.VIEWER)
  findAllByEmployee(@Param('employeeId') employeeId: string) {
    return this.contractsService.findAllByEmployee(employeeId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() data: CreateContractDto, @Req() req: RequestWithUser) {
    return this.contractsService.create(data, req.user.userId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id') id: string,
    @Body() data: UpdateContractDto,
    @Req() req: RequestWithUser,
  ) {
    return this.contractsService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.contractsService.remove(id, req.user.userId);
  }
}

interface RequestWithUser {
  user: { userId: string };
}
