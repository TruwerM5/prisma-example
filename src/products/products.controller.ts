import { Body, Get, Param, ParseIntPipe, Post, Req, UseGuards, Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product as ProductModel } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/generated/prisma/client';
import { RolesGuard } from 'src/guards/roles.guard';
import type { AuthenticatedRequest } from 'types';
import { EditProductDto } from './dto/edit-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  listProducts(): Promise<ProductModel[]> {
    return this.productsService.getAllProducts();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.seller)
  @Get('my-products')
  getSellersProducts(@Req() request: AuthenticatedRequest) {
    const sellerId = request.user.userId;
    return this.productsService.getProductsBySeller(sellerId);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  addProduct(
    @Body() product: CreateProductDto,
    @Req() request: AuthenticatedRequest
  ) {
    const sellerId = request.user?.userId;
    product.sellerId = sellerId;
    return this.productsService.createProduct(product);
  }

  @UseGuards(AuthGuard)
  @Put('/edit/:id')
  editProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() productDto: EditProductDto,
  ): Promise<ProductModel> {
    return this.productsService.editProduct(productId, productDto);
  }
}
