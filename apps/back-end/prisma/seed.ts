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

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@icctes.org' },
    update: {},
    create: {
      email: 'admin@icctes.org',
      password: hashedPassword,
      name: 'Admin ICCTES',
    },
  });

  // Seed projects
  const projects = [
    {
      title: 'Natal Jerusalém',
      description: 'Projeto de Natal na Praça Jerusalém.',
      fullDescription: 'Descrição completa do projeto de natal...',
      category: 'Social',
      date: '2024-12-25',
    },
    {
      title: 'Atelier Social',
      description: 'Capacitação profissional em artes.',
      fullDescription: 'O Atelier Social foca em transformar vidas...',
      category: 'Educação',
      date: '2024-11-10',
    },
  ];

  for (const projectData of projects) {
    const { ...data } = projectData;
    await prisma.project.create({ data });
  }

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
