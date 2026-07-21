import { UserStatus, Role } from 'src/generated/prisma/client';
export class GetUserDto {
  userId: number;
  email: string;
  name: string;
  status: UserStatus;
  role: Role;
}

export class GetUserWithPasswordDto extends GetUserDto {
  password: string;
}
