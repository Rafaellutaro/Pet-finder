-- CreateEnum
CREATE TYPE "AdoptionStep" AS ENUM ('CONFIRMATION', 'MEETING', 'MEETING_CONFIRMED', 'FINALIZE', 'COMPLETED', 'DECLINED');

-- CreateTable
CREATE TABLE "AdoptionProcess" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "petId" INTEGER NOT NULL,
    "adopterId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "step" "AdoptionStep" NOT NULL DEFAULT 'CONFIRMATION',
    "adopterConfirmedAt" TIMESTAMP(3),
    "ownerConfirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionProcess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionProcess_conversationId_key" ON "AdoptionProcess"("conversationId");

-- AddForeignKey
ALTER TABLE "AdoptionProcess" ADD CONSTRAINT "AdoptionProcess_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
