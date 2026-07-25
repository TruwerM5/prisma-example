import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, ProductsService],
})
export class CartModule {}
