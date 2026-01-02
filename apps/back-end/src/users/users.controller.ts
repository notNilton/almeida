import { Controller, Get, Put, Body, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    getProfile(@Request() req) {
        return this.usersService.findById(req.user.userId);
    }

    @Put('profile')
    updateProfile(@Request() req, @Body() data: any) {
        // Enforce that a user can only update their own non-role fields via this endpoint
        const { role, password, ...safeData } = data;
        return this.usersService.update(req.user.userId, safeData, req.user.userId);
    }

    @Get()
    @Roles(Role.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    findOne(@Param('id') id: string) {
        return this.usersService.findById(+id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() data: any, @Request() req) {
        return this.usersService.update(+id, data, req.user.userId);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string, @Body('deleteCode') deleteCode: string, @Request() req) {
        return this.usersService.remove(+id, req.user.userId, deleteCode);
    }

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() data: any, @Request() req) {
        return this.usersService.create(data, req.user.userId);
    }
}
