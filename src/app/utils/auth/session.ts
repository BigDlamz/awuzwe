import { v4 as uuidv4 } from 'uuid';
import prisma from "../../../../utils/primsa";


export const createSession = async (userId: string): Promise<string> => {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    await prisma.session.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
};

export const validateSession = async (token: string): Promise<string | null> => {
    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
        return null;
    }

    return session.user.id;
};

export const deleteSession = async (token: string): Promise<void> => {
    await prisma.session.delete({
        where: { token },
    });
};