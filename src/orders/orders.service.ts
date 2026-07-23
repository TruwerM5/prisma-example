import { Injectable } from '@nestjs/common';
import { Order } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order-dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllOrders(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        user: true,
        orderItems: true,
      },
      where: {
        userId,
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

  async createOrder(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
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
                productId: createOrderDto.productId,
              },
            },
            quantity: createOrderDto.quantity,
            summaryPrice: createOrderDto.summaryPrice,
          },
        },
      },
    });
  }
}
