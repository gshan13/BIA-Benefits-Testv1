/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `BIA` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uniqueId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPER_ADMIN', 'BIA', 'BUSINESS', 'EMPLOYEE');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_biaId_fkey";

-- DropIndex
DROP INDEX "Business_biaId_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "dealId" TEXT,
ALTER COLUMN "biaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BIA" ADD COLUMN     "uniqueId" TEXT;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessID" TEXT,
ADD COLUMN     "employeesId" TEXT,
ADD COLUMN     "uniqueId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employeesId" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "Roles" NOT NULL;

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "corporatePartner" TEXT NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "uniqueId" TEXT NOT NULL,
    "businessId" TEXT,
    "employeesId" TEXT,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BIA_uniqueId_key" ON "BIA"("uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Business_uniqueId_key" ON "Business"("uniqueId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_biaId_fkey" FOREIGN KEY ("biaId") REFERENCES "BIA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
