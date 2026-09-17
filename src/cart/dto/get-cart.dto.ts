import type { Decimal } from "@prisma/client/runtime/client";


export class GetCartDto {
    cartId: number;
    userId: number | null;
    token: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    items: GetCartItemDto[];
}

export class GetCartItemDto {
    cartItemId: number;
    quantity: number;
    product: GetProductInCartDto;
}

export class GetProductInCartDto {
    productId: number;
    name: string;
    price: Decimal;
    productImages: {
        productId: number;
        imagePath: string 
    }[];
}