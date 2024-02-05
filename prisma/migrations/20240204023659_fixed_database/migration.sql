/*
  Warnings:

  - You are about to drop the column `nameOfBia` on the `BIA` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `BIA` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `BIA` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropIndex
DROP INDEX "BIA_nameOfBia_key";

-- AlterTable
ALTER TABLE "BIA" DROP COLUMN "nameOfBia",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- CreateIndex
CREATE UNIQUE INDEX "BIA_name_key" ON "BIA"("name");
