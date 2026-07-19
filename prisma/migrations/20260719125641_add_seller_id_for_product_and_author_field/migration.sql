/*
  Warnings:

  - You are about to drop the column `productDetailId` on the `product_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_detail_id]` on the table `product_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_detail_id` to the `product_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_details" DROP CONSTRAINT "product_details_productDetailId_fkey";

-- DropIndex
DROP INDEX "product_details_productDetailId_key";

-- AlterTable
ALTER TABLE "product_details" DROP COLUMN "productDetailId",
ADD COLUMN     "author" TEXT,
ADD COLUMN     "product_detail_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "seller_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_details_product_detail_id_key" ON "product_details"("product_detail_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_product_detail_id_fkey" FOREIGN KEY ("product_detail_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
