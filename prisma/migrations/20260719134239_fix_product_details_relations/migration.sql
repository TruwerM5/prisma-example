/*
  Warnings:

  - The primary key for the `product_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `product_details` table. All the data in the column will be lost.
  - You are about to drop the column `product_detail_id` on the `product_details` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `product_details` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[seller_id,name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `product_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_details" DROP CONSTRAINT "product_details_productId_fkey";

-- DropIndex
DROP INDEX "product_details_productId_key";

-- DropIndex
DROP INDEX "products_name_key";

-- AlterTable
ALTER TABLE "product_details" DROP CONSTRAINT "product_details_pkey",
DROP COLUMN "productId",
DROP COLUMN "product_detail_id",
ADD COLUMN     "product_id" INTEGER NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "product_details_pkey" PRIMARY KEY ("product_id");

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE VARCHAR(150);

-- CreateIndex
CREATE UNIQUE INDEX "products_seller_id_name_key" ON "products"("seller_id", "name");

-- AddForeignKey
ALTER TABLE "product_details" ADD CONSTRAINT "product_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
