/*
  Warnings:

  - The primary key for the `audit_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `audit_logs` table. All the data in the column will be lost.
  - The primary key for the `contracts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `contracts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `contracts` table. All the data in the column will be lost.
  - The primary key for the `documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `ocrData` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `uploadId` on the `documents` table. All the data in the column will be lost.
  - The primary key for the `employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `employees` table. All the data in the column will be lost.
  - The primary key for the `uploads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `uploads` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatarId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upload_id]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upload_id` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_name` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_uploadId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatarId_fkey";

-- DropIndex
DROP INDEX "documents_uploadId_key";

-- DropIndex
DROP INDEX "users_avatarId_key";

-- AlterTable
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "entityId",
DROP COLUMN "entityType",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "entity_type" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "audit_logs_id_seq";

-- AlterTable
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "employeeId",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employee_id" TEXT NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "contracts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contracts_id_seq";

-- AlterTable
ALTER TABLE "documents" DROP CONSTRAINT "documents_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "employeeId",
DROP COLUMN "ocrData",
DROP COLUMN "updatedAt",
DROP COLUMN "uploadId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employee_id" TEXT,
ADD COLUMN     "ocr_data" JSONB,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "upload_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "documents_id_seq";

-- AlterTable
ALTER TABLE "employees" DROP CONSTRAINT "employees_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "employees_id_seq";

-- AlterTable
ALTER TABLE "uploads" DROP CONSTRAINT "uploads_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "originalName",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "original_name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "uploads_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "uploads_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "avatarId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "avatar_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "documents_upload_id_key" ON "documents"("upload_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_avatar_id_key" ON "users"("avatar_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
