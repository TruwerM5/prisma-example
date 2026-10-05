import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma, Product, ProductCategory } from "src/generated/prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";
import { EditProductDto } from "./dto/edit-product.dto";
import { Decimal } from "@prisma/client/runtime/client";
import type { ProductResponse } from "@shop/contracts";
import { CACHE_MANAGER, type Cache } from "@nestjs/cache-manager";

@Injectable()
export class ProductsService {
  cachedProductTTL: number;

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.cachedProductTTL = 1000 * 60 * 60 * 24;
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const cacheKey = "products";
    const cachedProducts = await this.cacheManager.get<ProductResponse[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }
    const products = await this.prisma.product.findMany({
      include: {
        productImages: true,
      },
      orderBy: {
        productId: "asc",
      },
    });

    const mapped = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      rating: product.rating.toNumber(),
    }));

    await this.cacheManager.set(cacheKey, mapped, this.cachedProductTTL);
    return mapped;
  }

  async getOneById(id: number): Promise<ProductResponse | null> {
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<ProductResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await this.prisma.product.findUnique({
      where: {
        productId: id,
      },
      select: {
        productId: true,
        name: true,
        price: true,
        rating: true,
        category: true,
        sellerId: true,
        productImages: true,
        productDetails: true,
      },
    });

    if (!product) {
      return null;
    }

    const mapped = {
      ...product,
      price: product.price.toNumber(),
      rating: product.rating.toNumber(),
    };

    await this.cacheManager.set(cacheKey, mapped, this.cachedProductTTL);
    return mapped;
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      include: {
        productDetails: true,
      },
    });
  }

  async getProductsByCategory(category: ProductCategory, excludeId?: number): Promise<ProductResponse[]> {
    const cacheKey = `products:category:${category}${excludeId ? `:excludeId:${excludeId}` : ""}`;
    const cached = await this.cacheManager.get<ProductResponse[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await this.prisma.product.findMany({
      where: {
        category,
        productId: {
          not: excludeId,
        },
      },
      include: {
        productImages: {
          take: 1,
        },
      },
      take: 10,
      orderBy: {
        rating: "desc",
      },
    });

    const mapped = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      rating: product.rating.toNumber(),
    }));

    await this.cacheManager.set(cacheKey, mapped, this.cachedProductTTL);

    return mapped;
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const { sellerId, category, ...rest } = product;
      const { productDetails, name, price } = rest;
      const createdProduct = await this.prisma.product.create({
        data: {
          name,
          price,
          category,
          seller: {
            connect: {
              userId: sellerId,
            },
          },
          productDetails: {
            create: {
              ...productDetails,
            },
          },
        },
        include: {
          productDetails: true,
        },
      });
      await this.clearCachedProducts();
      return createdProduct;
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        throw err;
      }
      const code = err.code;
      if (err.code === "P2002") {
        throw new ConflictException(code);
      }
      throw new BadRequestException(code);
    }
  }

  async editProduct(productId: number, productDto: EditProductDto): Promise<Product> {
    const { productDetails, name, price } = productDto;
    const editedProduct = await this.prisma.product.update({
      where: {
        productId: productId,
      },
      data: {
        name,
        price,
        productDetails: {
          update: {
            where: {
              productId,
            },
            data: {
              ...productDetails,
            },
          },
        },
      },
      include: {
        productDetails: {
          omit: {
            productId: true,
          },
        },
      },
    });

    await this.clearCachedProducts();
    return editedProduct;
  }

  async getProductPrice(productId: number): Promise<{ price: Decimal }> {
    const cacheKey = `product:price:${productId}`;
    const cached = await this.cacheManager.get<{ price: Decimal }>(cacheKey);
    if (cached) {
      return cached;
    }
    const productPrice = await this.prisma.product.findFirstOrThrow({
      where: {
        productId,
      },
      select: {
        price: true,
      },
    });

    await this.cacheManager.set(cacheKey, productPrice, this.cachedProductTTL);
    return productPrice;
  }

  private async clearCachedProducts() {
    await this.cacheManager.del("products");
  }
}
