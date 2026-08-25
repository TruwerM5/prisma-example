import { ProductImagesDto } from './product-images.dto';
import { ProductDetails } from 'src/generated/prisma/client';

export class GetProductDto {
    productId: number;
    name: string;
    price: number;
    sellerId: number;
    productImages: ProductImagesDto[];
}

export class GetFullProductDto extends GetProductDto {
    productDetails: ProductDetails | null;
}