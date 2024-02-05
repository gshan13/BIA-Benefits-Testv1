/*
  Warnings:

  - Added the required column `biaId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_biaId_fkey" FOREIGN KEY ("biaId") REFERENCES "BIA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
