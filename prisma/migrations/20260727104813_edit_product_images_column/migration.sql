/*
  Warnings:

  - You are about to drop the column `image_paths` on the `ProductImages` table. All the data in the column will be lost.
  - Added the required column `image_path` to the `ProductImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductImages" DROP COLUMN "image_paths",
ADD COLUMN     "image_path" TEXT NOT NULL;
