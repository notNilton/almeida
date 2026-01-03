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
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@almeida.com.br' },
    update: {},
    create: {
      email: 'admin@almeida.com.br',
      password: adminPassword,
      name: 'Admin Almeida',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // Create extra users
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@almeida.com.br' },
    update: {},
    create: {
      email: 'user@almeida.com.br',
      password: userPassword,
      name: 'João Silva',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@almeida.com.br' },
    update: {},
    create: {
      email: 'viewer@almeida.com.br',
      password: userPassword,
      name: 'Maria Oliveira',
      role: UserRole.VIEWER,
      status: UserStatus.ACTIVE,
    },
  });

  // Create Employees
  const employees = [
    { name: 'Ricardo Almeida', cpf: '123.456.789-00', registration: 'EMP001' },
    { name: 'Ana Souza', cpf: '234.567.890-11', registration: 'EMP002' },
    { name: 'Carlos Santos', cpf: '345.678.901-22', registration: 'EMP003' },
    { name: 'Fernanda Lima', cpf: '456.789.012-33', registration: 'EMP004' },
    { name: 'Juliana Castro', cpf: '567.890.123-44', registration: 'EMP005' },
  ];

  for (const empData of employees) {
    const employee = await prisma.employee.upsert({
      where: { cpf: empData.cpf },
      update: {},
      create: {
        ...empData,
        status: 'ACTIVE',
      },
    });

    // Create a contract for each employee if not exists
    const existingContract = await prisma.contract.findFirst({
      where: { employeeId: employee.id },
    });

    if (!existingContract) {
      await prisma.contract.create({
        data: {
          employeeId: employee.id,
          type: 'CLT',
          startDate: new Date('2023-01-01'),
          status: 'ACTIVE',
        },
      });
    }

    // Create an upload and a document for a couple of employees
    if (empData.registration === 'EMP001' || empData.registration === 'EMP002') {
      const filename = `doc_${employee.id}.pdf`;
      const upload = await prisma.upload.upsert({
        where: { filename },
        update: {},
        create: {
          filename,
          originalName: 'Documento_Identificacao.pdf',
          mimetype: 'application/pdf',
          size: 1024 * 500,
          url: `https://storage.almeida.com.br/uploads/${filename}`,
        },
      });

      await prisma.document.upsert({
        where: { uploadId: upload.id },
        update: {},
        create: {
          name: 'RG / CPF',
          type: 'OTHER',
          status: 'PROCESSED',
          employeeId: employee.id,
          uploadId: upload.id,
          ocrData: {
            nome: empData.name,
            cpf: empData.cpf,
            data_nascimento: '1990-05-15',
            rg: '12.345.678-9',
          },
        },
      });
    }
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
