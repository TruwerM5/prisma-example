import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';
@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [CartService, PrismaService],
  exports: [CartService]
})
export class CartModule {}
