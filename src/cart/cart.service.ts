import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ProductsService } from "src/products/products.service";
import { GetCartResponse } from "@shop/contracts";
@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: ProductsService,
  ) {}

  async addToCart(productId: number, cartToken?: string, userId?: number) {
    const product = await this.products.getOneById(productId);
    if (!product) {
      throw new BadRequestException("Product not found");
    }

    let cart: { cartId: number; token: string } | null = null;

    if (userId) {
      cart = await this.prisma.cart.findUnique({
        where: {
          userId,
        },
        select: {
          cartId: true,
          token: true,
        },
      });
    } else if (cartToken) {
      cart = await this.prisma.cart.findUnique({
        where: {
          token: cartToken,
        },
      });
    }

    if (!cart) {
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
    await this.prisma.cartItem.upsert({
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
    });

    return { cartToken: cart.token };
  }

  async getCart(cartToken?: string, userId?: number): Promise<GetCartResponse> {
    const emptyCart = {
      cartId: null,
      items: null,
    };

    if (!cartToken && !userId) {
      return emptyCart;
    }

    const [cart] = await this.prisma.$queryRaw<GetCartResponse[]>`
      SELECT 
        c1.user_id AS "userId", 
        c1.cart_id AS "cartId",
        c1.expires_at AS "expiresAt",
        json_agg(
          json_build_object(
            'cartItemId', c2.cart_item_id,
            'productId', p.product_id,
            'productName', p.name,
            'productPrice', p.price,
            'productImage', (
              SELECT
                image_path
              FROM
                product_images pi
              WHERE
                pi.product_id = p.product_id
              ORDER BY product_image_id ASC
              LIMIT 1
            ),
            'quantity', c2.quantity,
            'itemTotalPrice', c2.quantity * p.price
          ) ORDER BY c2.cart_item_id
        ) AS items,
        SUM(c2.quantity * p.price)::float AS "cartTotalPrice"
      FROM carts c1
      JOIN cart_items c2 ON c1.cart_id = c2.cart_id
      JOIN products p ON c2.product_id = p.product_id
      WHERE
        c1.user_id = ${userId} OR (c1.token = ${cartToken} AND c1.user_id IS NULL)
      GROUP BY c1.cart_id
      ORDER BY c1.cart_id ASC
      LIMIT 1;
    `;
    if (!cart) {
      return emptyCart;
    }

    return cart;
  }

  async mergeCarts(userId: number, cartToken: string) {
    return this.prisma.$transaction(async (tx) => {
      const userCart = await tx.cart.findUnique({
        where: {
          userId,
        },
        include: {
          items: true,
        },
      });
      const anonymousCart = await tx.cart.findFirst({
        where: {
          token: cartToken,
          userId: null,
        },
        include: {
          items: true,
        },
      });

      if (!anonymousCart && !userCart) {
        // nothing to merge
        return;
      }

      if (userCart && !anonymousCart) {
        return userCart.token;
      }

      if (anonymousCart && !userCart) {
        const updadetCart = await tx.cart.update({
          where: {
            token: cartToken,
          },
          data: {
            userId,
          },
          select: {
            token: true,
          },
        });
        return updadetCart.token;
      }

      if (anonymousCart && userCart) {
        for (const item of anonymousCart.items) {
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
              },
            },
          });
        }

        await tx.cart.delete({
          where: {
            cartId: anonymousCart.cartId,
          },
        });

        return userCart.token;
      }
    });
  }

  async deleteExpiredCarts() {
    await this.prisma.cart.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
