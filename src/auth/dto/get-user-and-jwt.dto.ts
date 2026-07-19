import { GetUserDto } from './get-user.dto';

export class GetUserAndJwtExpirationDto extends GetUserDto {
    iat: number;
    exp: number;
}