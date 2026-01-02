import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    constructor() {
        // Load environment variables
        dotenv.config({ path: path.join(process.cwd(), '.env') });
        if (!process.env.DATABASE_URL) {
            dotenv.config({ path: path.join(process.cwd(), '../../.env') });
        }

        const connectionString = process.env.DATABASE_URL;

        const pool = new Pool({
            connectionString,
            connectionTimeoutMillis: 10000, // 10 seconds timeout
            query_timeout: 10000, // 10 seconds query timeout
        });
        const adapter = new PrismaPg(pool);

        super({ adapter } as any);
        this.pool = pool;

        this.pool.on('error', (err) => {
            console.error('PrismaService: Unexpected error on idle client', err);
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }
}
