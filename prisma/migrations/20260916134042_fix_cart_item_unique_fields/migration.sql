/*
  Warnings:

  - A unique constraint covering the columns `[cart_item_id,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Made the column `category` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "cart_items_cart_id_product_id_key";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_item_id_product_id_key" ON "cart_items"("cart_item_id", "product_id");
