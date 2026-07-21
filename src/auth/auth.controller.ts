import { Controller, Post, Body, HttpCode, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUserDto } from './dto/get-user.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() credentials: LoginDto, 
    @Res({ passthrough: true }) response: Response,
  ): Promise<GetUserDto> {
    const { access_token, ...user } = await this.authService.signIn(credentials);
    response.cookie('jwt', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    return { ...user };
  }

  @Post('signup')
  signUp(@Body() credentials: SignUpDto): Promise<GetUserDto | null> {
    return this.authService.createUser(credentials);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response): { success: boolean } {
    try {
      response.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
      return { success: true };
    } catch {
      throw new BadRequestException();
    }
  }
}
