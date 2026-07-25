import { Injectable } from '@nestjs/common';
import { Cart } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly products: ProductsService,
    ) {}

    async addToCart(
        productId: number,
        cartToken?: string,
    ) {
        let cart = cartToken 
        ? await this.prisma.cart.findUnique({
            where: {
                token: cartToken,
            }
        })
        : null;
        if(!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
        }
        const cartItem = await this.prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.cartId,
                    productId,
                }
            },
            create: {
                cartId: cart.cartId,
                productId,
                quantity: 1,
            },
            update: {
                quantity: {
                    increment: 1,
                }
            }
        });
        return {
            cart,
            cartItem,
        }
    }

    async getCart(cartToken: string): Promise<Cart | null> {
        return this.prisma.cart.findFirst({
            where: {
                token: cartToken,
            }
        });
    }
}
