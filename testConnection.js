
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected successfully to SuperBase PostgresDB!!');
    } catch (e) {
        console.error('Error connecting to the database', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
