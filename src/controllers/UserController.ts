import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserController = {
    list: async () => {
        return await prisma.user.findMany();
    },
    create: async ({ body }: {
        body: {
            email: string,
            password: string
        }
    }) => {
        try {
            await prisma.user.create({
                data: body
            });

            return { message: 'success' };
        } catch (error) {
            return error;
        }
    }
}


