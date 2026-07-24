import { GetUserDto } from 'src/auth/dto/get-user.dto';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: GetUserDto;
}

export interface OptionalAuthenticatedRequest extends Request {
    user?: GetUserDto;
}