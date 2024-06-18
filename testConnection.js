
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully!');
    } catch (e) {
        console.error('Error connecting to the database', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
