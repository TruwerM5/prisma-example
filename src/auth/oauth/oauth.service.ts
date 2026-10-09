import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "crypto";

@Injectable()
export class OAuthService {
  userSelectFields = {
    userId: true,
    name: true,
    email: true,
    status: true,
    role: true,
  };
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(id: string, name: string, email: string | null) {
    const authenticatedUser = await this.prisma.$transaction(async (tx) => {
      if (!email) {
        throw new BadRequestException();
      }
      const existingOauthAccount = await tx.oAuthAccounts.findUnique({
        where: {
          provider_providerAccountId: {
            provider: "github",
            providerAccountId: id,
          },
        },
        select: {
          user: {
            select: this.userSelectFields,
          },
        },
      });

      if (existingOauthAccount) {
        return existingOauthAccount.user;
      }
      const existingUser = await tx.user.findUnique({
        where: {
          email,
        },
        select: this.userSelectFields,
      });
      if (existingUser) {
        throw new UnauthorizedException(`User with email ${email} already exists.`);
      }
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          oauthAccounts: {
            create: {
              provider: "github",
              providerAccountId: id,
            },
          },
        },
        select: this.userSelectFields,
      });
      return newUser;
    });

    const access_token = await this.jwtService.signAsync(authenticatedUser);
    return { access_token };
  }

  generateStateAndCodeChallenge() {
    const state = randomBytes(32).toString("hex");
    const codeChallenge = createHash("sha-256").update(state).digest("base64url");
    return { state, codeChallenge };
  }
}
