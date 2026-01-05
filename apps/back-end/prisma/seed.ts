import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 21);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  // --- Create Admin ---
  // Nota: Como removemos o autoincrement, precisamos gerar o ID no create.
  // No update, não precisamos passar o ID pois ele não muda.
  await prisma.user.upsert({
    where: { email: 'admin@almeida.com.br' },
    update: {},
    create: {
      id: nanoid(),
      email: 'admin@almeida.com.br',
      password: adminPassword,
      name: 'Admin Almeida',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // --- Create Users ---
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'user@almeida.com.br' },
    update: {},
    create: {
      id: nanoid(),
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
      id: nanoid(),
      email: 'viewer@almeida.com.br',
      password: userPassword,
      name: 'Maria Oliveira',
      role: UserRole.VIEWER,
      status: UserStatus.ACTIVE,
    },
  });

  // --- Create Employees ---
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
        id: nanoid(),
        ...empData,
        status: 'ACTIVE',
      },
    });

    // --- Create Contract ---
    const existingContract = await prisma.contract.findFirst({
      where: { employeeId: employee.id },
    });

    if (!existingContract) {
      await prisma.contract.create({
        data: {
          id: nanoid(),
          employeeId: employee.id,
          type: 'CLT',
          startDate: new Date('2023-01-01'),
          status: 'ACTIVE',
        },
      });
    }

    // --- Create Documents & Uploads ---
    if (empData.registration === 'EMP001' || empData.registration === 'EMP002') {
      const filename = `doc_${employee.id}.pdf`; // Usando o ID do employee no nome

      const upload = await prisma.upload.upsert({
        where: { filename },
        update: {},
        create: {
          id: nanoid(),
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
          id: nanoid(),
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