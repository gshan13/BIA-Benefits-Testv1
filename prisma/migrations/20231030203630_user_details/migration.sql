-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_biaId_fkey";

-- AlterTable
ALTER TABLE "BIA" ADD COLUMN     "biaId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "biaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_biaId_fkey" FOREIGN KEY ("biaId") REFERENCES "BIA"("id") ON DELETE SET NULL ON UPDATE CASCADE;
