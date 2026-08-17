/*
  Warnings:

  - You are about to drop the column `category` on the `product_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_details" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" "ProductCategory";
