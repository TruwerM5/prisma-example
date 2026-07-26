import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        const product = await this.products.getOneById(productId);
        if(!product) {
            throw new BadRequestException('Product not found');
        }
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

    async getCart(cartToken: string) {
        return this.prisma.cart.findFirst({
            where: {
                token: cartToken,
            },
            select: {
                cartId: true,
                items: {
                    include: {
                        cart: false,
                        product: {
                            include: {
                                productImages: true
                            }
                        }
                    },
                },
            }
        });
    }
}
