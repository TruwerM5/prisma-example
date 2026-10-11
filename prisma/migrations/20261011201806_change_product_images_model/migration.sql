-- DropIndex
DROP INDEX "product_images_product_id_key";

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "product_image_id" SERIAL NOT NULL,
ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("product_image_id");
