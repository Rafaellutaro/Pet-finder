/*
  Warnings:

  - You are about to drop the column `Loyal` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `energetic` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `friendly` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `playful` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `smart` on the `Pet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_userId_fkey";

-- DropForeignKey
ALTER TABLE "petImg" DROP CONSTRAINT "petImg_petId_fkey";

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "Loyal",
DROP COLUMN "energetic",
DROP COLUMN "friendly",
DROP COLUMN "playful",
DROP COLUMN "smart",
ADD COLUMN     "heartsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Trait" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetTrait" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "traitId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "PetTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "traitId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trait_key_key" ON "Trait"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PetTrait_petId_traitId_key" ON "PetTrait"("petId", "traitId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_traitId_key" ON "UserPreference"("userId", "traitId");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petImg" ADD CONSTRAINT "petImg_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetTrait" ADD CONSTRAINT "PetTrait_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetTrait" ADD CONSTRAINT "PetTrait_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
