import type { Request } from "express";
import type { UserResponse } from "@shop/contracts";
export interface AuthenticatedRequest extends Request {
  user: UserResponse;
}

export interface OptionalAuthenticatedRequest extends Request {
  user?: UserResponse;
  cookies: {
    jwt?: string;
    cartToken?: string;
    oauth_gh_state?: string;
  };
}

export interface SignInWithOAuthParameters {
  code: string;
  state: string;
}
