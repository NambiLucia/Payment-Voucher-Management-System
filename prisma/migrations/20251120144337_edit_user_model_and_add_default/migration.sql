/*
  Warnings:

  - You are about to drop the column `accountCode` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `beneficiaryCode` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the column `budgetCode` on the `Voucher` table. All the data in the column will be lost.
  - You are about to drop the `Code_type` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `accountId` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beneficiaryId` to the `Voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Code_type" DROP CONSTRAINT "Code_type_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'INITIATOR';

-- AlterTable
ALTER TABLE "public"."Voucher" DROP COLUMN "accountCode",
DROP COLUMN "beneficiaryCode",
DROP COLUMN "budgetCode",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "beneficiaryId" TEXT NOT NULL,
ADD COLUMN     "budgetId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Code_type";

-- DropEnum
DROP TYPE "public"."Type";

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beneficiary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_code_key" ON "public"."Account"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_code_key" ON "public"."Budget"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_code_key" ON "public"."Beneficiary"("code");

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "public"."Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "public"."Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
