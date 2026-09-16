import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { GetCartResponse } from "@shop/contracts";

@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly products: ProductsService,
    ) {}

    async addToCart(
        productId: number,
        cartToken?: string,
        userId?: number,
    ) {
        const product = await this.products.getOneById(productId);
        if(!product) {
            throw new BadRequestException('Product not found');
        }

        let cart: Cart | null = null;

        if(userId) {
            cart = await this.prisma.cart.findUnique({
                where: {
                    userId,
                },
            });
        } else if(cartToken) {
            cart = await this.prisma.cart.findUnique({
                where: {
                    token: cartToken,
                }
            });
        }

        if(!cart) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1);
            cart = await this.prisma.cart.create({
                data: {
                    userId: userId ?? null,
                    expiresAt: expiresAt,
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
            },
            include: {
                product: {
                    include: {
                        productImages: true,
                    }
                }
            }
        });
        
        return {
            cart,
            cartItem: {
                ...cartItem,
                product: {
                    ...cartItem.product,
                    price: cartItem.product.price.toNumber(),
                },
            },
        };
    }

    async getCart(cartToken?: string, userId?: number): Promise<GetCartResponse> {
        const emptyCart = {
            items: null,
        };

        if(!cartToken) {
            return emptyCart;
        }
        
        const cart = await this.prisma.cart.findFirst({
            where: {
                userId,
                token: cartToken,
            },
            select: {
                cartId: true,
                createdAt: true,
                expiresAt: true,
                userId: true,
                items: {
                    select: {
                        cartItemId: true,
                        quantity: true,
                        product: {
                            select: {
                                productId: true,
                                name: true,
                                price: true,
                                productImages: true,
                            },
                        },
                    },
                },
            },
        });

        if(!cart) {
            return emptyCart;
        }

        return {
            ...cart,
            items: cart.items.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    price: item.product.price.toNumber(),
                }
            })),
        };
    }
}
