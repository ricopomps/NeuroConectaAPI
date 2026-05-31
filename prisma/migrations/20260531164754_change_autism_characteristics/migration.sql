/*
  Warnings:

  - You are about to drop the column `autismCharacteristics` on the `CaseStudy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaseStudy" DROP COLUMN "autismCharacteristics",
ADD COLUMN     "neurodivergentCharacteristics" TEXT[];
