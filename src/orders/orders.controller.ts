import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AddToCartDto } from './dto/create-order-dto';
import type { AuthenticatedRequest, OptionalAuthenticatedRequest } from 'types';
import { AuthGuard } from 'src/guards/auth.guard';
import { Order, OrderItem } from 'src/generated/prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
}
