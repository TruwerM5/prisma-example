-- AlterTable
CREATE SEQUENCE product_details_product_detail_id_seq;
ALTER TABLE "product_details" ALTER COLUMN "product_detail_id" SET DEFAULT nextval('product_details_product_detail_id_seq'),
ADD CONSTRAINT "product_details_pkey" PRIMARY KEY ("product_detail_id");
ALTER SEQUENCE product_details_product_detail_id_seq OWNED BY "product_details"."product_detail_id";

-- DropIndex
DROP INDEX "product_details_product_detail_id_key";
