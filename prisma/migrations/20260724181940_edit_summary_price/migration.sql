/*
  Warnings:

  - Changed the type of `summaryPrice` on the `order_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "summaryPrice",
ADD COLUMN     "summaryPrice" MONEY NOT NULL;
