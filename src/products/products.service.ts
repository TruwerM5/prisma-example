import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Product, ProductCategory } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { Decimal } from '@prisma/client/runtime/client';
import { GetFullProductDto, GetProductDto } from './dto/get-product.dto';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<GetProductDto[]> {
    const products = await this.prisma.product.findMany({
      include: {
        productImages: true,
      },
      orderBy: {
        productId: 'asc',
      }
    });
    
    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));
  }

  async getOneById(id: number): Promise<GetFullProductDto | null> {
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
      }
    });

    if(!product) {
      return null;
    }

    return {
      ...product,
      price: product.price.toNumber(),
    }
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

  async getProductsByCategory(category: ProductCategory, excludeId?: number): Promise<GetProductDto[]> {
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
        rating: 'desc',
      },
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }))
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const { sellerId, ...rest } = product;
      const { productDetails, name, price } = rest;
      return await this.prisma.product.create({
        data: {
          name,
          price,
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
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
        throw err;
      }
      const code = err.code;
      if (err.code === 'P2002') {
        throw new ConflictException(code);
      }
      throw new BadRequestException(code);
    }
  }

  async editProduct(productId: number, productDto: EditProductDto): Promise<Product> {
    const { productDetails, name, price } = productDto;
    return this.prisma.product.update({
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
  }

  async getProductPrice(productId: number): Promise<{ price: Decimal }> {
    return this.prisma.product.findFirstOrThrow({
      where: {
        productId
      },
      select: {
        price: true,
      }
    });
  } 
}
