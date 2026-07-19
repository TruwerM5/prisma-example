import { PrismaClient } from 'src/generated/prisma/client';
import { Prisma } from 'src/generated/prisma/client';

// const prisma = new PrismaClient();
const products: Prisma.ProductCreateInput[] = [
    {
        name: '1984',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {   
                price: 10,
                author: 'George Orwell',
                description: "Nineteen Eighty-Four is a dystopian speculative fiction novel by the English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final completed book. Thematically, it centres on totalitarianism, mass surveillance and repressive regimentation of people and behaviours.",
            }
            
        }
    },{
        name: 'Dandelion Wine',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                price: 8.63,
                author: 'Ray Bradbury',
                description: "Ray Bradbury's 1957 semi-autobiographical novel Dandelion Wine is set in the summer of 1928 in the fictional Green Town, Illinois. The story follows 12-year-old Douglas Spaulding as he discovers the magic of small-town life, grapples with his own mortality, and witnesses the bittersweet realities of adulthood",
            }
        }
    },
]

export async function seedProducts(prisma: PrismaClient) {
    for(const product of products) {
        await prisma.product.create({
            data: product,
        });
    }
    return products;
}