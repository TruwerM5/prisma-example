/*
  Warnings:

  - You are about to drop the `_products_in_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_products_in_order" DROP CONSTRAINT "_products_in_order_A_fkey";

-- DropForeignKey
ALTER TABLE "_products_in_order" DROP CONSTRAINT "_products_in_order_B_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_details" ADD COLUMN     "discount" DECIMAL(65,30);

-- DropTable
DROP TABLE "_products_in_order";

-- CreateTable
CREATE TABLE "order_items" (
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "summaryPrice" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "discounts" (
    "productId" INTEGER NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "order_items_product_id_key" ON "order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_id_key" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_productId_key" ON "discounts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_productId_key" ON "Wishlist"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_key" ON "Wishlist"("userId");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
