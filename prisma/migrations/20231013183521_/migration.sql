/*
  Warnings:

  - You are about to alter the column `phBia` on the `BIA` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `phPersonOfContact` on the `BIA` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "BIA" ALTER COLUMN "phBia" SET DATA TYPE INTEGER,
ALTER COLUMN "phPersonOfContact" SET DATA TYPE INTEGER;
