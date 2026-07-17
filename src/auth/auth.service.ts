import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { compare } from 'bcrypt';
import { GetUserDto } from './dto/get-user.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    userData: Prisma.UserCreateInput,
  ): Promise<GetUserDto & AccessTokenDto> {
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

      const { password, ...result } = newUser;
      const access_token = await this.jwtService.signAsync(result);
      return { ...result, access_token };
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('User already exists');
      }
      throw err;
    }
  }

  async signIn(credentials: LoginDto): Promise<GetUserDto & AccessTokenDto> {
    const { email, password: inputPassword } = credentials;
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

    const { password, ...result } = user;
    const access_token = await this.jwtService.signAsync(result);
    return { ...result, access_token };
  }
}
