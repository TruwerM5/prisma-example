const { env } = process;
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "src/generated/prisma/client";

const connectionString = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:5433/${env.POSTGRES_DB}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const alice = await prisma.user.upsert({
        where: {email: "alice@prisma.io"},
        update: {},
        create: {
            email: "alice@prisma.io",
            name: "Alice",
            password: "secret",
        },
    });

    const bob = await prisma.user.upsert({
        where: {email: 'bob@prisma.io'},
        update: {},
        create: {
            email: "bob@prisma.io",
            name: "Bob",
            password: "secret",
        },
    });

    console.log({ alice, bob });
}

main()
.then(async () => {
    await prisma.$disconnect();
    await pool.end();    
})
.catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
})