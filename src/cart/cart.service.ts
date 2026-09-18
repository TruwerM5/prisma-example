import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart, CartItem } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { GetCartResponse } from "@shop/contracts";
import { GetCartDto, GetCartItemDto } from './dto/get-cart.dto';
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
                    token: cartToken,
                },
            });
        }
        const cartItem = await this.prisma.cartItem.upsert({
            create: {
                cartId: cart.cartId,
                productId,
                quantity: 1,
            },
            where: {
                cartId: cart.cartId,
                productId,
            },
            update: {
                quantity: {
                    increment: 1,
                },
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
            cartId: null,
            items: null,
        };

        if(!cartToken && !userId) {
            return emptyCart;
        }

        const cart = await this.prisma.cart.findFirst({
            where: {
                OR: [
                    {
                        userId,
                    },
                    {
                        AND: {
                            token: cartToken,
                            userId: null
                        }
                    }
                ],
            },
            select: {
                token: true,
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

        const { token, ...resultCart } = cart;

        return {
            ...resultCart,
            items: resultCart.items.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    price: item.product.price.toNumber(),
                }
            })),
        };
    }

    async mergeCarts(userId: number, cartToken: string) {
        await this.prisma.$transaction(async (tx) => {
            const userCart = await tx.cart.findUnique({
                where: {
                    userId,
                },
                include: {
                    items: true,
                }
            });
            const anonymousCart = await tx.cart.findUnique({
                where: {
                    token: cartToken,
                },
                include: {
                    items: true,
                }
            });
            
            if (!anonymousCart && !userCart) { // nothing to merge
                return;
            }

            if(userCart && !anonymousCart) {
                return userCart;
            }

            if(anonymousCart && !userCart) {
                return await tx.cart.update({
                    where: {
                        token: cartToken,
                    },
                    data: {
                        userId,
                    },
                });
            }

            if(anonymousCart && userCart) {
                if(anonymousCart.cartId === userCart.cartId) {
                    return userCart;
                }

                for(const item of anonymousCart.items) {
                    await tx.cartItem.upsert({
                        where: {
                            cartId_productId: {
                                cartId: userCart.cartId,
                                productId: item.productId,
                            },
                        },
                        create: {
                            cartId: userCart.cartId,
                            productId: item.productId,
                            quantity: item.quantity,
                        },
                        update: {
                            quantity: {
                                increment: item.quantity,
                            }
                        }
                    });
                }

                await tx.cart.delete({
                    where: {
                        cartId: anonymousCart.cartId
                    }
                });
            }
            return userCart;
        });
    }
}
