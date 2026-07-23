import { IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  summaryPrice: number;

  @IsNumber()
  quantity: number;
}
