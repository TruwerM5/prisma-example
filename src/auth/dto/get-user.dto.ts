import { UserStatus, Role } from 'src/generated/prisma/client';
export class GetUserDto {
    email: string;
    name: string;
    status: UserStatus;
    role: Role;
}