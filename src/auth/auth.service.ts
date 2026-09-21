import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { compare } from 'bcrypt';
import { genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CartService } from 'src/cart/cart.service';

import type { 
  UserResponse, 
  UserWithPasswordResponse,
  AuthenticatedUserResponse
} from '@shop/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cartService: CartService,
  ) {}

  async getUser(jwtToken: string): Promise<UserResponse | { userId: null }> {
    const payload = await this.jwtService.verifyAsync<UserResponse>(jwtToken);
    if(!payload) {
      return { userId: null };
    }
    return payload;
  }

  async createUser(userData: Prisma.UserCreateInput): Promise<AuthenticatedUserResponse> {
    try {
      const { password: inputPassword } = userData;
      const salt = await genSalt();
      const hashStr = await hash(inputPassword, salt);
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
      if (
        err instanceof Prisma.PrismaClientKnownRequestError && 
        err.code === 'P2002'
      ) {
        throw new ConflictException('User already exists');
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

    const isMatch = await compare(inputPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const result = this.getUserPayload(user);
    const access_token = await this.jwtService.signAsync(result);

    if(cartToken) {
      newCartToken = await this.cartService.mergeCarts(result.userId, cartToken) || '';
    }

    return {
      ...result,
      access_token,
      newCartToken,
    };
  }

  private getUserPayload(user: UserWithPasswordResponse): UserResponse {
    const { password, ...result } = user;
    return result;
  }
}
