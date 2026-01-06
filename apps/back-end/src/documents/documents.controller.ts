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
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER, Role.VIEWER)
  findAll() {
    return this.documentsService.findAll();
  }

  @Get('employee/:employeeId')
  @Roles(Role.ADMIN, Role.USER, Role.VIEWER)
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.documentsService.findByEmployee(employeeId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() data: any, @Req() req: RequestWithUser) {
    return this.documentsService.create(data, req.user.userId);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: RequestWithUser,
  ) {
    return this.documentsService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.documentsService.remove(id, req.user.userId);
  }

  @Post(':id/ocr')
  @Roles(Role.ADMIN)
  processOcr(@Param('id') id: string, @Body() body: { ocrData: string }) {
    return this.documentsService.processOcr(id, body.ocrData);
  }
}

interface RequestWithUser {
  user: { userId: string };
}
