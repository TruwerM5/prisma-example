/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `product_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `product_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_details" DROP CONSTRAINT "product_details_product_detail_id_fkey";

-- AlterTable
ALTER TABLE "product_details" ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_details_productId_key" ON "product_details"("productId");

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
