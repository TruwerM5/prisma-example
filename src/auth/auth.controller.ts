import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Res,
  BadRequestException,
  Req,
  ValidationPipe,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import type { Response, CookieOptions } from "express";
import type { UserResponse } from "@shop/contracts";
import type { OptionalAuthenticatedRequest } from "types";

@Controller("auth")
export class AuthController {
  private readonly cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  } satisfies CookieOptions;

  constructor(private readonly authService: AuthService) {}

  @Get()
  async getIsAuthenticated(@Req() request: OptionalAuthenticatedRequest) {
    const jwt: string | undefined = request.cookies?.jwt;
    if (!jwt) {
      return { userId: null };
    }
    return this.authService.getUser(jwt);
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Req() request: OptionalAuthenticatedRequest,
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponse> {
    const cartToken: string | undefined = request.cookies?.cartToken;
    const { access_token, newCartToken, ...user } = await this.authService.signIn(credentials, cartToken);
    response.cookie("jwt", access_token, this.cookieOptions);
    if (newCartToken) {
      response.cookie("cartToken", newCartToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    return { ...user };
  }

  @Post("signup")
  async signUp(
    @Body(new ValidationPipe()) credentials: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponse | null> {
    const { access_token, ...user } = await this.authService.createUser(credentials);
    response.cookie("jwt", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    return { ...user };
  }

  @Post("logout")
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response): { success: boolean } {
    try {
      response.clearCookie("jwt");
      response.clearCookie("cartToken");
      response.clearCookie("ouath_gh_state");
      return { success: true };
    } catch {
      throw new BadRequestException();
    }
  }

  @Get("github/auth-url")
  getGitHubAuthUrl(@Res({ passthrough: true }) res: Response): { requestUrl: string } {
    const cookieOptions = { ...this.cookieOptions, maxAge: 1000 * 60 * 10 };
    const urlParameters = this.authService.getGitHubOAuthRequestUrl();
    const { requestUrl, state } = urlParameters;
    res.cookie("oauth_gh_state", state, cookieOptions);
    return { requestUrl };
  }

  @Get("github")
  async ouathGitHub(
    @Query("code") code: string,
    @Req() request: OptionalAuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { oauth_gh_state } = request.cookies;
    if (!oauth_gh_state) {
      throw new UnauthorizedException();
    }
    const { access_token } = await this.authService.signInWithGitHub({
      code,
      state: oauth_gh_state,
    });
    response.cookie("jwt", access_token, this.cookieOptions);
    response.redirect(process.env.FRONTEND_URL as string);
  }

  @Get("yandex/auth-url")
  getYandexAuthUrl(): { requestUrl: string } {
    const urlParameters = this.authService.getYandexOAuthRequestUrl();
    const { requestUrl } = urlParameters;
    return { requestUrl };
  }

  @Get("yandex")
  async oauthYandex(
    @Query("code") code: string,
    @Query("state") state: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.signInWithYandex({
      code,
      state,
    });
    response.cookie("jwt", access_token, this.cookieOptions);
    response.redirect(process.env.FRONTEND_URL as string);
  }
}
