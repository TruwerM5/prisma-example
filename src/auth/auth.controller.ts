import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUserDto } from './dto/get-user.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() credentials: LoginDto): Promise<GetUserDto> {
        const user = await this.authService.getUser(credentials);
        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    @Post('signup')
    signUp(@Body() credentials: SignUpDto): Promise<GetUserDto | null> {
        return this.authService.createUser(credentials);
    }
}
