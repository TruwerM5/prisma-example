import {
  Body,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product as ProductModel } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  listProducts(): Promise<ProductModel[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  addProduct(@Body() product: CreateProductDto, @Req() request) {
    const sellerId: number = request.user?.userId;
    product.sellerId = sellerId;
    return this.productsService.createProduct(product);
  }
}
