/*
  Warnings:

  - You are about to alter the column `rating` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(10,2);
