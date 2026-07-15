import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from 'src/generated/prisma/client';
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    getUser() {
        return this.userService.users({});
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserModel | null> {
        return this.userService.user({ userId: Number(id) });
    }

    @Post()
    async signupUser(@Body() userData: {name?: string; email: string }): Promise<UserModel> {
        return this.userService.createUser(userData);
    }
}
