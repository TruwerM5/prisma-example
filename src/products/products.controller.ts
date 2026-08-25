import { Body, Get, Param, ParseIntPipe, Post, Req, UseGuards, Put, ParseEnumPipe, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, ProductCategory, Product as ProductModel } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/generated/prisma/client';
import { RolesGuard } from 'src/guards/roles.guard';
import type { AuthenticatedRequest } from 'types';
import { EditProductDto } from './dto/edit-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  listProducts(): Promise<GetProductDto[]> {
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

  @Get('/category/:category')
  getByCategory(
    @Param('category', new ParseEnumPipe(ProductCategory)) category: ProductCategory,
    @Query('excludeId', ParseIntPipe) excludeId?: number,
  ): Promise<GetProductDto[]> {
    return this.productsService.getProductsByCategory(category, excludeId);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  addProduct(@Body() product: CreateProductDto, @Req() request: AuthenticatedRequest) {
    const sellerId = request.user?.userId;
    product.sellerId = sellerId;
    return this.productsService.createProduct(product);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.seller)
  @Put('/edit/:id')
  editProduct(@Param('id', ParseIntPipe) productId: number, @Body() productDto: EditProductDto): Promise<ProductModel> {
    return this.productsService.editProduct(productId, productDto);
  }
}
