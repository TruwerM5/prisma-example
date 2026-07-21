import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GetUserAndJwtExpirationDto } from 'src/auth/dto/get-user-and-jwt.dto';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: GetUserAndJwtExpirationDto = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const jwt = request.cookies.jwt as string;
    return jwt;
  }
}
