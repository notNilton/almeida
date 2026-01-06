import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit-log.service';
import { nanoid } from '../common/utils/nanoid';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    console.log(`[UsersService] findById called with id: "${id}"`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          avatar: true,
        },
      });

      if (user) {
        console.log(`[UsersService] Found user with avatar: ${user.email}`);
        return user;
      }

      // If user is null, it might be due to broken relation or actually not found.
      // Let's try fetching without relation to be sure.
      const userSimple = await this.prisma.user.findUnique({
        where: { id },
      });

      if (userSimple) {
        console.warn(
          `[UsersService] User found WITHOUT avatar relation (possible broken FK): ${userSimple.email}`,
        );
        return { ...userSimple, avatar: null };
      }

      console.log(`[UsersService] User truly not found: ${id}`);
      return null;
    } catch (error) {
      console.error(`[UsersService] Error fetching user ${id}:`, error);
      // Fallback: try fetching without include
      try {
        const userRetry = await this.prisma.user.findUnique({ where: { id } });
        if (userRetry) {
          return { ...userRetry, avatar: null };
        }
      } catch (innerError) {
        console.error('Critical error fetching user:', innerError);
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateUserDto, adminUserId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = data;

    const updated = await this.prisma.user.update({
      where: { id },
      data: rest,
    });

    if (adminUserId) {
      await this.auditLog.log(adminUserId, 'UPDATE_USER', 'User', id, rest);
    }

    return updated;
  }

  async remove(id: string, adminUserId: string, deleteCode: string) {
    let masterHash = process.env.MASTER_DELETE_CODE_HASH;
    if (!masterHash) masterHash = '$2b$10$legacyhashplaceholder'; // Fallback for dev if needed

    const isValid =
      deleteCode === process.env.MASTER_DELETE_CODE ||
      (masterHash && (await bcrypt.compare(deleteCode, masterHash)));

    if (!isValid) {
      throw new Error('Código de exclusão incorreto.');
    }

    await this.auditLog.log(adminUserId, 'DELETE_USER', 'User', id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async create(data: CreateUserDto, adminUserId: string) {
    const { password, ...rest } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = nanoid();
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        id,
        password: hashedPassword,
      },
    });

    await this.auditLog.log(adminUserId, 'CREATE_USER', 'User', user.id, rest);

    return user;
  }
}
