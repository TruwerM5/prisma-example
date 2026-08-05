import { Decimal } from '@prisma/client/runtime/client';
import { ProductImagesDto } from './product-images.dto';
import { ProductDetails } from 'src/generated/prisma/client';

export class GetProductDto {
    productId: number;
    name: string;
    price: Decimal;
    sellerId: number;
    productDetails: ProductDetails | null;
    productImages: ProductImagesDto[];
}