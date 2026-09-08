import { IsString, IsDecimal, IsArray, IsNumber } from 'class-validator';
import { ProductDetailsDto } from './product-details.dto';
import type { ProductCategory } from '@shop/contracts';
export class CreateProductDto {
  @IsString()
  name: string;
  
  @IsNumber()
  sellerId: number;

  @IsString()
  category: ProductCategory;

  @IsDecimal()
  price: number;

  @IsArray()
  images?: string[];

  productDetails: ProductDetailsDto;
}
