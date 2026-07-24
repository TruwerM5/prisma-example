import { IsNumber } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  summaryPrice: number;

  @IsNumber()
  quantity: 1;
}
