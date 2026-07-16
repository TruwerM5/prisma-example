import { Injectable, ConflictException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { compare } from 'bcrypt';
import { GetUserDto } from './dto/get-user.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(userData: Prisma.UserCreateInput): Promise<GetUserDto> {
        try {
            const { password: inputPassword } = userData;
            const salt = await genSalt();
            const hashStr = await hash(inputPassword, salt);
            const newUser = await this.prisma.user.create({ 
                data: {
                    ...userData,
                    password: hashStr,
                } 
            });

            const { password, ...rest } = newUser;
            return rest;
        } catch(err) {
            if(err.code === 'P2002') {
                throw new ConflictException('User already exists');
            }
            throw err;
        }
    }

    async getUser(credentials: { email: string; password: string }): Promise<GetUserDto | null> {
        const { email, password: inputPassword } = credentials;
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });
        if(!user) {
            return null;
        }

        const isMatch = await compare(inputPassword, user.password);
        if(!isMatch) {
            return null
        }

        const {password, ...rest} = user;
        return rest;
    }

}
