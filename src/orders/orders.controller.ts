import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AddToCartDto } from './dto/create-order-dto';
import type { AuthenticatedRequest, OptionalAuthenticatedRequest } from 'types';
import { AuthGuard } from 'src/guards/auth.guard';
import { Order, OrderItem } from 'src/generated/prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Get()
  listOrders(@Req() req: OptionalAuthenticatedRequest) {
    if(req.user) {
      return this.ordersService.getAllOrders(req.user.userId);
    }
    return [];
  }

  @UseGuards(AuthGuard)
  @Post('create')
  addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() data: AddToCartDto
  ): Promise<Order | OrderItem> {
    const userId = req.user.userId;
    return this.ordersService.createOrEditOrder(userId, data);
  }
}
