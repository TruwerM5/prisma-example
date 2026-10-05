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
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import type { Response, Request } from "express";
import type { UserResponse } from "@shop/contracts";
import type { OptionalAuthenticatedRequest } from "types";

@Controller("auth")
export class AuthController {
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
    response.cookie("jwt", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });
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
      return { success: true };
    } catch {
      throw new BadRequestException();
    }
  }

  @Get("github/auth-url")
  getGitHubAuthUrl() {
    return this.authService.getGitHubOAuthRequestUrl();
  }

  @Get("github")
  async ouathGitHub(@Query("code") code: string, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.authService.signInWithGitHub(code);
    response.cookie("jwt", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });
    response.redirect("http://localhost:3030");
    response.end();
  }
}
