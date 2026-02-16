-- CreateEnum
CREATE TYPE "MeetingProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "MeetingProposal" (
    "id" SERIAL NOT NULL,
    "adoptionProcessId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "meetingAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER,
    "status" "MeetingProposalStatus" NOT NULL DEFAULT 'PENDING',
    "respondedById" INTEGER,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeetingProposal_adoptionProcessId_idx" ON "MeetingProposal"("adoptionProcessId");

-- CreateIndex
CREATE INDEX "MeetingProposal_createdById_idx" ON "MeetingProposal"("createdById");

-- CreateIndex
CREATE INDEX "MeetingProposal_status_idx" ON "MeetingProposal"("status");

-- CreateIndex
CREATE INDEX "MeetingProposal_addressId_idx" ON "MeetingProposal"("addressId");

-- AddForeignKey
ALTER TABLE "MeetingProposal" ADD CONSTRAINT "MeetingProposal_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingProposal" ADD CONSTRAINT "MeetingProposal_adoptionProcessId_fkey" FOREIGN KEY ("adoptionProcessId") REFERENCES "AdoptionProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingProposal" ADD CONSTRAINT "MeetingProposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingProposal" ADD CONSTRAINT "MeetingProposal_respondedById_fkey" FOREIGN KEY ("respondedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
