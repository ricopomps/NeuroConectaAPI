/*
  Warnings:

  - You are about to drop the column `developmentMilestones` on the `CaseStudy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaseStudy" DROP COLUMN "developmentMilestones",
ADD COLUMN     "observations" TEXT;
