import { Controller, Post, Get, Req, Res, Body, ParseIntPipe } from "@nestjs/common";
import { CartService } from "./cart.service";
import type { Response } from "express";
import type { OptionalAuthenticatedRequest } from "types";
import type { GetCartResponse } from "@shop/contracts";
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() request: OptionalAuthenticatedRequest): Promise<GetCartResponse> {
    const userId = request.user?.userId;
    const cartToken: string | undefined = request.cookies?.cartToken;
    return this.cartService.getCart(cartToken, userId);
  }

  @Post("add-to-cart")
  async addToCart(
    @Req() request: OptionalAuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
    @Body("productId", ParseIntPipe) productId: number,
  ): Promise<GetCartResponse> {
    const cartToken: string | undefined = request.cookies?.cartToken;
    const userId = request.user?.userId;
    const result = await this.cartService.addToCart(productId, cartToken, userId);
    if (!cartToken) {
      response.cookie("cartToken", result.cartToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    return this.cartService.getCart(cartToken, userId);
  }
}
