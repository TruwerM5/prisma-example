/*
  Warnings:

  - You are about to drop the column `productPrice` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `summaryPrice` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productPrice",
DROP COLUMN "summaryPrice",
ADD COLUMN     "product_price" MONEY NOT NULL DEFAULT 0,
ADD COLUMN     "summary_price" MONEY NOT NULL DEFAULT 0;
