-- CreateTable
CREATE TABLE "StudentFile" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentFile_studentId_idx" ON "StudentFile"("studentId");

-- AddForeignKey
ALTER TABLE "StudentFile" ADD CONSTRAINT "StudentFile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
