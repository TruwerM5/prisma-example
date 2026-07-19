import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Product } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async getAllProducts(): Promise<Product[]> {
        return await this.prisma.product.findMany({
            include: { productDetails: true },
        });
    }

    async getOneById(id: number): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: {
                productId: id,
            },
            include: { productDetails: true },
        });
        if(!product) {
            throw new NotFoundException();
        }
        return product;
    }

    async createProduct(product: CreateProductDto): Promise<Product> {
        try {
            const { sellerId, ...rest } = product;
            const { productDetails, name } = rest;
            return await this.prisma.product.create({
                data: {
                    name,
                    seller: {
                        connect: {
                            userId: sellerId,
                        }
                    },
                    productDetails: {
                        create: {
                            ...productDetails
                        }
                    }
                },
                include: { productDetails: true }
            });
        } catch(err) {
            const code = err.code;
            if(err.code === 'P2002') {
                throw new ConflictException(code);
            }
            throw new BadRequestException(code);
        }		
	}
}
