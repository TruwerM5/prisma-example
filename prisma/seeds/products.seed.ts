import { PrismaClient } from 'src/generated/prisma/client';
import { Prisma } from 'src/generated/prisma/client';

const products: Prisma.ProductCreateInput[] = [
    {
        name: '1984',
        price: 10,
        rating: 4.5,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'George Orwell',
                description: "Nineteen Eighty-Four is a dystopian speculative fiction novel by the English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final completed book. Thematically, it centres on totalitarianism, mass surveillance and repressive regimentation of people and behaviours.",
            }
            
        }
    },{
        name: 'Dandelion Wine',
        price: 8.63,
        rating: 4.8,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Ray Bradbury',
                description: "Ray Bradbury's 1957 semi-autobiographical novel Dandelion Wine is set in the summer of 1928 in the fictional Green Town, Illinois. The story follows 12-year-old Douglas Spaulding as he discovers the magic of small-town life, grapples with his own mortality, and witnesses the bittersweet realities of adulthood",
            }
        }
    },{
        name: 'Fahrenheit 451',
        price: 9.45,
        rating: 4.7,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Ray Bradbury',
                description: 'Fahrenheit 451 is a dystopian novel set in a future society where books are banned and burned by firemen. The story follows Guy Montag, a fireman who begins to question his role and the society in which he lives.',
            }
        }
    },{
        name: 'Brave New World',
        price: 11.20,
        rating: 4.6,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Aldous Huxley',
                description: 'Brave New World is a dystopian novel set in a futuristic society where people are engineered and conditioned for predetermined social roles. The novel explores themes of technology, freedom, individuality, and social control.',
            }
        }
    },{
        name: 'The Great Gatsby',
        price: 7.99,
        rating: 4.4,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'F. Scott Fitzgerald',
                description: 'The Great Gatsby follows the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan. Set during the Jazz Age, the novel explores wealth, love, ambition, and the illusion of the American Dream.',
            }
        }
    },{
        name: 'The Catcher in the Rye',
        price: 8.75,
        rating: 4.2,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'J. D. Salinger',
                description: 'The Catcher in the Rye follows teenager Holden Caulfield after he leaves his boarding school and spends several days wandering through New York City. The novel explores alienation, identity, and the difficulties of growing up.',
            }
        }
    },{
        name: 'To Kill a Mockingbird',
        price: 10.50,
        rating: 4.9,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Harper Lee',
                description: 'To Kill a Mockingbird is set in the American South and follows Scout Finch as her father, lawyer Atticus Finch, defends a man falsely accused of a serious crime. The novel examines prejudice, justice, morality, and empathy.',
            }
        }
    },{
        name: 'The Hobbit',
        price: 12.30,
        rating: 4.9,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'J. R. R. Tolkien',
                description: 'The Hobbit follows Bilbo Baggins, a hobbit who joins a company of dwarves on a journey to reclaim their homeland and treasure from the dragon Smaug. Along the way, Bilbo discovers courage and a mysterious magical ring.',
            }
        }
    },{
        name: 'The Picture of Dorian Gray',
        price: 9.10,
        rating: 4.6,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Oscar Wilde',
                description: 'The Picture of Dorian Gray tells the story of a young man whose portrait mysteriously ages while he remains physically young. The novel explores beauty, morality, corruption, and the consequences of a life devoted to pleasure.',
            }
        }
    },{
        name: 'Crime and Punishment',
        price: 13.40,
        rating: 4.8,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Fyodor Dostoevsky',
                description: 'Crime and Punishment follows Rodion Raskolnikov, a poor former student in Saint Petersburg who commits a murder and struggles with guilt and paranoia. The novel examines morality, redemption, suffering, and human psychology.',
            }
        }
    },{
        name: 'The Old Man and the Sea',
        price: 6.95,
        rating: 4.3,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'Ernest Hemingway',
                description: 'The Old Man and the Sea tells the story of Santiago, an aging Cuban fisherman who struggles with a giant marlin far out at sea. The novel explores perseverance, pride, dignity, and the relationship between humans and nature.',
            }
        }
    },{
        name: 'Animal Farm',
        price: 7.50,
        rating: 4.7,
        category: 'books',
        seller: {
            connect: {
                userId: 1,
                role: 'seller',
            }
        },
        productDetails: {
            create: {
                author: 'George Orwell',
                description: 'Animal Farm is a political allegory about farm animals who rebel against their human owner in hopes of creating an equal society. Their revolution gradually develops into a new system of oppression led by the pigs.',
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