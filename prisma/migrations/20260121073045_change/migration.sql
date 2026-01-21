-- AlterTable
ALTER TABLE "public"."Voucher" ALTER COLUMN "voucherNo" DROP DEFAULT,
ALTER COLUMN "voucherNo" SET DATA TYPE TEXT;
DROP SEQUENCE "voucher_voucherno_seq";
