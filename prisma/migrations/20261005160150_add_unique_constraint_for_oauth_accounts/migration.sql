/*
  Warnings:

  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `oauth_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_provider_account_id_key" ON "oauth_accounts"("provider", "provider_account_id");
