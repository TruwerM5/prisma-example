import { IsString, IsDecimal, IsArray, IsNumber } from 'class-validator';
import type { ProductCategory } from 'src/generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  sellerId: number;

  @IsDecimal()
  price: number;

  @IsArray()
  images?: string[];


  productDetails: ProductDetailsDto;
}

class ProductDetailsDto {
  @IsString()
  description: string;

  @IsString()
  category: ProductCategory;

  @IsString()
  color?: string;

  @IsString()
  size?: string;

  @IsString()
  author?: string;
}
