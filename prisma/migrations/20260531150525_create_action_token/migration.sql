-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCOUNT_CONFIRMATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "ActionToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActionToken_email_type_idx" ON "ActionToken"("email", "type");

-- CreateIndex
CREATE INDEX "ActionToken_email_type_token_idx" ON "ActionToken"("email", "type", "token");
