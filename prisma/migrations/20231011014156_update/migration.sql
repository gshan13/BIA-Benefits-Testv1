/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "active" SET NOT NULL;
