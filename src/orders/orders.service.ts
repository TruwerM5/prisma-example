import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddToCartDto } from './dto/create-order-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      select: {
        orderId: true,
        orderItems: {
          select: {
            product: {
              select: {
                productId: true,
                productDetails: {
                  select: {
                    price: true,
                    images: true
                  }
                }
              }
            },
            quantity: true,
            summaryPrice: true,
          },
        },
      },
    });
  }

  async getOrderByOrderId(orderId: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: {
        orderId,
      },
    });
  }

  async getProductInOrder(userId: number, productId: number) {
    return this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
        }
      },
      select: {
        orderId: true,
        productId: true,
        quantity: true,
      }
    });
  }

  async createOrEditOrder(userId: number, createOrderDto: AddToCartDto): Promise<Order | OrderItem> {
    const { productId } = createOrderDto;
    const productInCart = await this.getProductInOrder(userId, productId);
    if(!productInCart) {
      return this.createOrder(userId, createOrderDto);
    }
    const { orderId, productId: productInCartId, quantity } = productInCart;
    return this.setProductQuantity(orderId, productInCartId, quantity + 1);
  }

  async createOrder(userId: number, createOrderDto: AddToCartDto): Promise<Order> {
    const { productId } = createOrderDto;
     const { price: productPrice } = await this.getProductPrice(productId);
    return this.prisma.order.create({
      data: {
        user: {
          connect: {
            userId,
          },
        },
        orderItems: {
          create: {
            product: {
              connect: {
                productId,
              },
            },
            summaryPrice: productPrice,
          },
        },
      },
      include: {
        orderItems: true,
      }
    });
  }

  async setProductQuantity(orderId: number, productId: number, newQuantity: number) {
    const { price: productPrice } = await this.getProductPrice(productId);
    const newSummaryPrice = Number(productPrice) * newQuantity;
    return this.prisma.orderItem.update({
      where: {
        orderId,
        productId,
      },
      data: {
        quantity: newQuantity,
        summaryPrice: newSummaryPrice,
      }
    });
  }

  private async getProductPrice(productId: number) {
    return this.prisma.productDetails.findFirstOrThrow({
      where: {
        productId,
      },
      select: {
        price: true,
      }
    });
  }
}
