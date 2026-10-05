import "dotenv/config";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { PrismaService } from "src/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { CartModule } from "src/cart/cart.module";
import { OAuthService } from "src/auth/oauth/oauth.service";
import { GithubProvider } from "./oauth/github/github";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, OAuthService, GithubProvider],
  imports: [
    UserModule,
    CartModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
})
export class AuthModule {}
