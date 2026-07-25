import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, OrderItem, OrderStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddToCartDto } from './dto/create-order-dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: ProductsService,
  ) {}
}
