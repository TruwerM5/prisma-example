import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from 'src/generated/prisma/client';
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    getUser() {
        return {name: 'John', age: 32}
    }

    @Post()
    async signupUser(@Body() userData: {name?: string; email: string }): Promise<UserModel> {
        return this.userService.createUser(userData);
    }
}
