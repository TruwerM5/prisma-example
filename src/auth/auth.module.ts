import "dotenv/config";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { PrismaService } from "src/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { CartModule } from "src/cart/cart.module";
import { OAuthService } from "src/auth/oauth/oauth.service";
import { GithubOAuth } from "./oauth/github/github.oauth";
import { YandexOAuth } from "./oauth/yandex/yandex.oauth";
import { HttpClientModule } from "@nestjs/http-client";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, OAuthService, GithubOAuth, YandexOAuth],
  imports: [
    UserModule,
    CartModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    HttpClientModule.register({
      timeout: "10s",
    }),
  ],
})
export class AuthModule {}
