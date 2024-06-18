import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {logger} from "../../../../logger";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { name, surname, city, contactNumber } = await req.json();

        if (!name || !surname || !city || !contactNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newEngineer = await prisma.engineer.create({
            data: {
                name,
                surname,
                city,
                contactNumber,
            },
        });
        logger.info('Successfully created am engineer');
        return NextResponse.json(newEngineer, { status: 201 });
    } catch (error) {
       logger.error('Error creating engineer:', error);
        return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
    }
}
