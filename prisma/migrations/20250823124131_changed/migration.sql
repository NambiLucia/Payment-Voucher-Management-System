-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "is_approved" SET DEFAULT false,
ALTER COLUMN "role" DROP NOT NULL;
