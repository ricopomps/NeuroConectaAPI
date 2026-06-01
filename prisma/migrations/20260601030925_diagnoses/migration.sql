/*
  Warnings:

  - You are about to drop the column `diagnosis` on the `CaseStudy` table. All the data in the column will be lost.
  - You are about to drop the column `hasDiagnosis` on the `CaseStudy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaseStudy" DROP COLUMN "diagnosis",
DROP COLUMN "hasDiagnosis",
ADD COLUMN     "diagnoses" JSONB;
