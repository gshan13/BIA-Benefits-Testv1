-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BIA" (
    "id" TEXT NOT NULL,
    "nameOfBia" TEXT NOT NULL,
    "personOfContact" TEXT NOT NULL,
    "emailOfContact" TEXT NOT NULL,
    "phBia" INTEGER NOT NULL,
    "phPersonOfContact" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "BIA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "biaId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BIA_nameOfBia_key" ON "BIA"("nameOfBia");

-- CreateIndex
CREATE UNIQUE INDEX "BIA_emailOfContact_key" ON "BIA"("emailOfContact");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_biaId_fkey" FOREIGN KEY ("biaId") REFERENCES "BIA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
