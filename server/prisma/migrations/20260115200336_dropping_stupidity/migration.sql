/*
  Warnings:

  - You are about to drop the column `heartsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `viewsCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "heartsCount",
DROP COLUMN "viewsCount";
