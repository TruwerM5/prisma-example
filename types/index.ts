import type { Request } from 'express';
import type { UserResponse } from '@shop/contracts';
export interface AuthenticatedRequest extends Request {
    user: UserResponse;
}

export interface OptionalAuthenticatedRequest extends Request {
    user?: UserResponse;
}