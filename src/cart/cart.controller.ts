import { Controller, Post, Get, Req, Res, Body, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import type { Request, Response } from 'express';
import { Cart, CartItem } from 'src/generated/prisma/client';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(
    @Req() request: Request
  ) {
    const cartToken = request.cookies?.cartToken;
    if(!cartToken) {
      return [];
    }
    return await this.cartService.getCart(cartToken) || [];
  }

  @Post('add-to-cart')
  async addToCart(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body('productId', ParseIntPipe) productId: number,
  ): Promise<{cart: Cart, cartItem: CartItem}> {
    const cartToken = request.cookies?.cartToken;
    const result = await this.cartService.addToCart(productId, cartToken);
    if(!cartToken) {
      response.cookie('cartToken', result.cart.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    return {
      cart: result.cart,
      cartItem: result.cartItem,
    };
  }

}
