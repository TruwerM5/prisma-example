/*
  Warnings:

  - You are about to drop the column `discount` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product_details` table. All the data in the column will be lost.
  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_details" DROP COLUMN "discount",
DROP COLUMN "images",
DROP COLUMN "price";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "ProductImages" (
    "product_id" INTEGER NOT NULL,
    "image_paths" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductImages_product_id_key" ON "ProductImages"("product_id");

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
