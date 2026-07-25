import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Product } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { Decimal } from '@prisma/client/runtime/client';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        productDetails: true,
      },
    });
  }

  async getOneById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        productId: id,
      },
      include: {
        productDetails: true,
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    return product;
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
