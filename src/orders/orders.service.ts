import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly products: ProductsService,
  ) {}
}
