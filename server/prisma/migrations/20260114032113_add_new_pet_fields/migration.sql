/*
  Warnings:

  - Added the required column `Loyal` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energetic` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `food` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendly` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playPlace` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playful` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sleepPlace` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smart` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toy` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wayOfLyfe` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "Loyal" INTEGER NOT NULL,
ADD COLUMN     "energetic" INTEGER NOT NULL,
ADD COLUMN     "food" TEXT NOT NULL,
ADD COLUMN     "friendly" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "playPlace" TEXT NOT NULL,
ADD COLUMN     "playful" INTEGER NOT NULL,
ADD COLUMN     "sleepPlace" TEXT NOT NULL,
ADD COLUMN     "smart" INTEGER NOT NULL,
ADD COLUMN     "toy" TEXT NOT NULL,
ADD COLUMN     "wayOfLyfe" TEXT NOT NULL;
