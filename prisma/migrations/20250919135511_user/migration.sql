-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'USER';
