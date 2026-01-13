-- AlterTable
CREATE SEQUENCE "public".voucher_voucherno_seq;
ALTER TABLE "public"."Voucher" ALTER COLUMN "voucherNo" SET DEFAULT nextval('"public".voucher_voucherno_seq'),
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "createdById" DROP DEFAULT;
ALTER SEQUENCE "public".voucher_voucherno_seq OWNED BY "public"."Voucher"."voucherNo";
