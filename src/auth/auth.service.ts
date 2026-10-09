import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma.service";
import { compare } from "bcrypt";
import { genSalt, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { CartService } from "src/cart/cart.service";
import {
  UserResponse,
  UserWithPasswordResponse,
  AuthenticatedUserResponse,
  UnknownUserResponse,
} from "@shop/contracts";
import { SignUpDto } from "./dto/signup.dto";
import { OAuthService } from "src/auth/oauth/oauth.service";
import { GithubOAuth } from "./oauth/github/github.oauth";
import type { SignInWithOAuthParameters } from "types";
import { YandexOAuth } from "./oauth/yandex/yandex.oauth";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cartService: CartService,
    private readonly oauthService: OAuthService,
    private readonly github: GithubOAuth,
    private readonly yandex: YandexOAuth,
  ) {}

  async getUser(jwtToken: string): Promise<UnknownUserResponse> {
    const payload = await this.jwtService.verifyAsync<UnknownUserResponse>(jwtToken);
    if (!payload) {
      return { userId: null };
    }
    return payload;
  }

  async createUser(credentials: SignUpDto): Promise<AuthenticatedUserResponse> {
    const { confirmPassword, password, ...userData } = credentials;
    if (confirmPassword !== password) {
      throw new BadRequestException("Password are not equal");
    }
    try {
      const salt = await genSalt();
      const hashStr = await hash(password, salt);
      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashStr,
        },
      });

      const result = this.getUserPayload(newUser);
      const access_token = await this.jwtService.signAsync(result);
      return {
        ...result,
        access_token,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictException("User already exists");
      }
      throw err;
    }
  }

  async signIn(credentials: LoginDto, cartToken?: string): Promise<AuthenticatedUserResponse> {
    const { email, password: inputPassword } = credentials;
    let newCartToken: string | undefined = undefined;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.password) {
      throw new BadRequestException();
    }

    const isMatch = await compare(inputPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const result = this.getUserPayload(user);
    const access_token = await this.jwtService.signAsync(result);

    if (cartToken) {
      newCartToken = (await this.cartService.mergeCarts(result.userId, cartToken)) || "";
    }

    return {
      ...result,
      access_token,
      newCartToken,
    };
  }

  getGitHubOAuthRequestUrl() {
    return this.github.getRequestUrl();
  }

  async signInWithGitHub(parameters: SignInWithOAuthParameters) {
    const ghUser = await this.github.getProfile(parameters);
    const { id, email, login } = ghUser;
    return this.oauthService.authenticate(String(id), login, email);
  }

  getYandexOAuthRequestUrl() {
    return this.yandex.getRequestUrl();
  }

  async signInWithYandex(parameters: SignInWithOAuthParameters) {
    const yandexUser = await this.yandex.getProfile(parameters);
    const { id, emails, first_name } = yandexUser;
    return this.oauthService.authenticate(id, first_name, emails[0]);
  }

  private getUserPayload(user: UserWithPasswordResponse): UserResponse {
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }
}
