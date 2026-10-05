import { IsString } from "class-validator";
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
