/*
  Warnings:

  - You are about to drop the `_OrderToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProduct" DROP CONSTRAINT "_OrderToProduct_B_fkey";

-- DropTable
DROP TABLE "_OrderToProduct";

-- CreateTable
CREATE TABLE "_products_in_order" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_products_in_order_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_products_in_order_B_index" ON "_products_in_order"("B");

-- AddForeignKey
ALTER TABLE "_products_in_order" ADD CONSTRAINT "_products_in_order_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_products_in_order" ADD CONSTRAINT "_products_in_order_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
