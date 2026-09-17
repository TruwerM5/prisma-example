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
        
        let userCart: GetCartDto | null = null;
        let anonymousCart: GetCartDto | null = null;
        let existingCart: GetCartDto | null = null;

        const carts = await this.prisma.cart.findMany({
            where: {
                OR: [
                    {
                        userId,
                    },
                    {
                        AND: {
                            token: cartToken,
                            userId: null,
                        },
                    },
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
        //TODO
        switch(carts.length) {
            case 0:
                return emptyCart;
            case 1:
                existingCart = carts[0];
            break;
            case 2:
                userCart = carts.find((cart) => cart.userId === userId) || null;
                anonymousCart = carts.find((cart) => cart.token === cartToken) || null;

                if(userCart && anonymousCart) {
                    const items: GetCartItemDto[] | null[] = [
                        ...userCart.items,
                        ...anonymousCart.items,
                    ];
                    const productIdsSet = new Set([...items.map(item => item.product.productId)]);
                    

                    
                    items.forEach(item => {
                        console.log(item.product.productId);
                    })
                    existingCart = {
                        // cartId: userCart.cartId,
                        // createdAt: userCart.createdAt,
                        // expiresAt: userCart.expiresAt,
                        // userId: userCart.userId,
                        ...userCart,
                        
                    };
                }else if(anonymousCart) {
                    console.log('has anonymous cart');
                    existingCart = {
                        ...anonymousCart,
                    };
                }
            break;
            default:
                throw new BadRequestException('more than 2 carts in database');
        }
        console.log(existingCart);
        if(!existingCart) {
            return emptyCart;
        }

        if(existingCart.userId && existingCart.userId === userId) {

        }

        const { token, ...resultCart } = existingCart;

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
}
