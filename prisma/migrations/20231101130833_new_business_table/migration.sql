/*
  Warnings:

  - You are about to drop the column `Category` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Business` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Business_email_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "street1" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "Category",
DROP COLUMN "Name",
DROP COLUMN "Phone",
DROP COLUMN "city",
DROP COLUMN "email",
DROP COLUMN "province",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER_SERVICES',
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "street1" TEXT,
ADD COLUMN     "street2" TEXT;
