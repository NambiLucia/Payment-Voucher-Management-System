/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Beneficiary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "public"."Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_name_key" ON "public"."Beneficiary"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_name_key" ON "public"."Budget"("name");
