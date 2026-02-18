-- CreateTable
CREATE TABLE "MeetingConfirmation" (
    "id" SERIAL NOT NULL,
    "adoptionProcessId" INTEGER NOT NULL,
    "adopterConfirmedAt" TIMESTAMP(3),
    "ownerConfirmedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetingConfirmation_adoptionProcessId_key" ON "MeetingConfirmation"("adoptionProcessId");

-- CreateIndex
CREATE INDEX "MeetingConfirmation_finalizedAt_idx" ON "MeetingConfirmation"("finalizedAt");

-- AddForeignKey
ALTER TABLE "MeetingConfirmation" ADD CONSTRAINT "MeetingConfirmation_adoptionProcessId_fkey" FOREIGN KEY ("adoptionProcessId") REFERENCES "AdoptionProcess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
