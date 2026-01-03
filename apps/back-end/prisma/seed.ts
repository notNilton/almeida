import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import { UserRole, UserStatus } from '@prisma/client';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@almeida.com.br' },
    update: {},
    create: {
      email: 'admin@almeida.com.br',
      password: hashedPassword,
      name: 'Admin Almeida',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
