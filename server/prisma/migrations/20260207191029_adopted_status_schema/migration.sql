-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('AVAILABLE', 'PENDING', 'ADOPTED');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "conversationStatus" "ConversationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "petStatus" "PetStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "PetsAdopted" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "adoptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetsAdopted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PetsAdopted_adopterId_idx" ON "PetsAdopted"("adopterId");

-- CreateIndex
CREATE UNIQUE INDEX "PetsAdopted_petId_key" ON "PetsAdopted"("petId");

-- AddForeignKey
ALTER TABLE "PetsAdopted" ADD CONSTRAINT "PetsAdopted_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetsAdopted" ADD CONSTRAINT "PetsAdopted_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
