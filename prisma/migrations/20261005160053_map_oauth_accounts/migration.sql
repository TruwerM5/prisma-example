/*
  Warnings:

  - You are about to drop the `OAuthAccounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OAuthAccounts" DROP CONSTRAINT "OAuthAccounts_user_id_fkey";

-- DropTable
DROP TABLE "OAuthAccounts";

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "oauth_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("oauth_id")
);

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
