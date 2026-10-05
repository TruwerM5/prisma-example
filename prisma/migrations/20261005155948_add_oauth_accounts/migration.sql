-- CreateTable
CREATE TABLE "OAuthAccounts" (
    "oauth_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,

    CONSTRAINT "OAuthAccounts_pkey" PRIMARY KEY ("oauth_id")
);

-- AddForeignKey
ALTER TABLE "OAuthAccounts" ADD CONSTRAINT "OAuthAccounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
