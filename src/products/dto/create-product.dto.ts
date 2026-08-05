import { IsString, IsDecimal, IsArray, IsNumber } from 'class-validator';
import { ProductDetailsDto } from './product-details.dto';
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
