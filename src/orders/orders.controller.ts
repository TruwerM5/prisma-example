import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import type { AuthenticatedRequest } from 'types';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/generated/prisma/enums';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.user)
  @Get()
  listOrders(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.ordersService.getAllOrders(userId);
  }

  @Post('create')
  addToCart(@Req() req: AuthenticatedRequest, @Body() data: CreateOrderDto) {
    const userId = req.user.userId;
    return this.ordersService.createOrder(userId, data);
  }
}
