import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CartService } from './cart/cart.service';
import { ProductsService } from './products/products.service';

@Module({
    providers: [
        PrismaService,
        CartService,
        ProductsService
    ],
})
export class CliModule {}