import { IsString } from 'class-validator';
import type { ProductCategory } from 'src/generated/prisma/enums';

export class ProductDetailsDto {
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