import type { Decimal } from "@prisma/client/runtime/client";


export class GetCartDto {
    cartId: number;
    expiresAt: Date | null;
    items: GetCartItemDto[];
}

export class GetCartItemDto {
    quantity: number;
    product: GetProductInCartDto;
}

export class GetProductInCartDto {
    productId: number;
    name: string;
    price: Decimal;
    productImages: { imagePath: string }[];
}