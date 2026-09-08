import { IsString } from 'class-validator';
import type { ProductCategory } from '@shop/contracts';
export class ProductDetailsDto {
  @IsString()
  description: string;

  @IsString()
  color?: string;

  @IsString()
  size?: string;

  @IsString()
  author?: string;
}