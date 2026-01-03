import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<Partial<User> | null> {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });

            if (!user || !(await bcrypt.compare(pass, user.password))) {
                return null;
            }

            if (user.status !== UserStatus.ACTIVE) {
                throw new ForbiddenException('Usuário aguardando aprovação ou inativo.');
            }

            const { password, ...result } = user;
            return result;
        } catch (error) {
            if (error instanceof ForbiddenException) throw error;
            console.error('AuthService: DB query error', error);
            throw error;
        }
    }

    async login(user: Partial<User>) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            },
        };
    }

    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                status: UserStatus.PENDING,
            },
        });
    }
}
