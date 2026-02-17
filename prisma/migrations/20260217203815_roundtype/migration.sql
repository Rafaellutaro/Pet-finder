-- CreateEnum
CREATE TYPE "MeetingProposalType" AS ENUM ('INITIAL', 'RESCHEDULE');

-- AlterTable
ALTER TABLE "AdoptionProcess" ADD COLUMN     "meetingRound" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "MeetingProposal" ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "MeetingProposalType" NOT NULL DEFAULT 'INITIAL';
