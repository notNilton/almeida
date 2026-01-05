/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_avatarId_key" ON "users"("avatarId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
