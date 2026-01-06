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
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER, Role.VIEWER)
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() data: any, @Req() req: RequestWithUser) {
    return this.employeesService.create(data, req.user.userId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: RequestWithUser,
  ) {
    return this.employeesService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.employeesService.remove(id, req.user.userId);
  }
}

interface RequestWithUser {
  user: { userId: string };
}
