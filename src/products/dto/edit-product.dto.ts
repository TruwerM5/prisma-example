import { IsString, IsDecimal, IsArray } from "class-validator";
import type { ProductCategory } from 'src/generated/prisma/enums';

export class EditProductDto {
    @IsString()
    name?: string;

    productDetails: EditProductDetailsDto;
}

class EditProductDetailsDto {
  @IsDecimal()
  price?: number;

  @IsString()
  description?: string;

  @IsString()
  category?: ProductCategory;

  @IsString()
  color?: string;

  @IsString()
  size?: string;

  @IsString()
  author?: string;

  @IsArray()
  images?: string[];
}