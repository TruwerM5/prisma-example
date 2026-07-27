import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";
import type { OptionalAuthenticatedRequest } from "types";
import { GetUserAndJwtExpirationDto } from "src/auth/dto/get-user-and-jwt.dto";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}

    async use(req: OptionalAuthenticatedRequest, res: Response, next: NextFunction) {
        const jwt = req.cookies?.jwt;
        if(!jwt) {
            next();
            return;
        }
        try {
            const payload: GetUserAndJwtExpirationDto = await this.jwtService.verifyAsync(jwt);
            req.user = payload;
        } catch {
            req.user = undefined;
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });
        }

        next();
    }
}