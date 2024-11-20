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
    },
    update: async ({ params, body }: {
        params: {
            id: string
        },
        body: {
            email: string,
            password: string
        }
    }) => {
        try {
            await prisma.user.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            });

            return { message: 'success' };
        } catch (error) {
            return error;
        }
    },
    remove: async ({ params }: {
        params: {
            id: string
        }
    }) => {
        try {
            await prisma.user.delete({
                where: {
                    id: parseInt(params.id)
                }
            });

            return { message: 'success' };
        } catch (error) {
            return error;
        }
    },
    findSomeField: async () => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    credit: true,
                    level: true
                }
            });

            return users;
        } catch (error) {
            return error;
        }
    },
    sort: async () => {
        return await prisma.user.findMany({
            orderBy: {
                credit: 'desc'
            }
        });
    },
    filter: async () => {
        return await prisma.user.findMany({
            where: {
                level: 'user'
            }
        });
    },
    moreThan: async () => {
        return await prisma.user.findMany({
            where: {
                credit: { gte: 300 } /// greater than or equal to 300
            }
        });
    },
    lessThan: async () => {
        return await prisma.user.findMany({
            where: {
                credit: {
                    lt: 300
                }
            }
        });
    },
    notEqual: async () => {
        return await prisma.user.findMany({
            where: {
                credit: {
                    not: 300
                }
            }
        });
    },
    in: async () => {
        return await prisma.user.findMany({
            where: {
                credit: { in: [100, 200, 300] }
            }
        });
    },
    isNull: async () => {
        return await prisma.user.findMany({
            where: {
                credit: {
                    equals: null
                }
            }
        });
    },
    isNotNull: async () => {
        return await prisma.user.findMany({
            where: {
                credit: {
                    not: null
                }
            }
        });
    },
    between: async () => {
        return await prisma.user.findMany({
            where: {
                credit: {
                    gte: 100, // greater than or equal to 100
                    lte: 300 // less than or equal to 300
                }
            }
        });
    },
    count: async () => {
        try {
            const totalRows = await prisma.user.count();

            return { totalRows };
        } catch (error) {
            return error;
        }
    },
    sum: async () => {
        try {
            const result = await prisma.user.aggregate({
                _sum: {
                    credit: true
                }
            });

            return { sum: result._sum.credit };
        } catch (error) {
            return error;
        }
    },
    max: async () => {
        try {
            const result = await prisma.user.aggregate({
                _max: {
                    credit: true
                }
            });

            return { max: result._max.credit };
        } catch (error) {
            return error;
        }
    },
    min: async () => {
        return await prisma.user.aggregate({
            _min: {
                credit: true
            }
        });
    },
    avg: async () => {
        return await prisma.user.aggregate({
            _avg: {
                credit: true
            }
        });
    },
    usersAndDepartment: async () => {
        try {
            const users = await prisma.user.findMany({
                include: {
                    department: true
                }
            });

            return users;
        } catch (err) {
            return err;
        }
    },
    signIn: async ({ body }: {
        body: {
            email: string,
            password: string
        }
    }) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: body.email,
                    password: body.password
                }
            })

            return { user: user };
        } catch (err) {
            return err;
        }
    }
}











