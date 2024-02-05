/*
  Warnings:

  - You are about to drop the column `Description` on the `Deal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;
