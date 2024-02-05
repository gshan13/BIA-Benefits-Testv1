/*
  Warnings:

  - You are about to drop the column `name` on the `BIA` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameOfBia]` on the table `BIA` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameOfBia` to the `BIA` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BIA_name_key";

-- AlterTable
ALTER TABLE "BIA" DROP COLUMN "name",
ADD COLUMN     "nameOfBia" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BIA_nameOfBia_key" ON "BIA"("nameOfBia");
