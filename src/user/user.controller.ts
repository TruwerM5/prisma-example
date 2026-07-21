import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from 'src/generated/prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import type { AuthenticatedRequest } from 'types';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.users({});
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserModel> {
    const user = await this.userService.user({ userId: id });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post()
  async signupUser(@Body() userData: Prisma.UserCreateInput): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
