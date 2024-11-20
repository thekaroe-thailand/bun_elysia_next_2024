const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const DepartmentController = {
    list: async () => {
        return await prisma.department.findMany({
            include: {
                users: true
            }
        })
    },
    usersInDepartment: async ({ params }: { params: { id: string } }) => {
        try {
            const level = 'user';
            const users = await prisma.department.findMany({
                where: {
                    id: parseInt(params.id)
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            level: true,
                            email: true,
                            credit: true
                        },
                        where: {
                            level: level
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            })

            return { users: users };
        } catch (err) {
            return err;
        }
    },
    createDepartmentAndUsers: async ({ body }: {
        body: {
            department: {
                name: string
            },
            users: {
                email: string,
                password: string
            }[]
        }
    }) => {
        try {
            const department = await prisma.department.create({
                data: {
                    name: body.department.name
                }
            })

            await prisma.user.createMany({
                data: body.users.map((user) => ({
                    email: user.email,
                    password: user.password,
                    departmentId: department.id
                }))
            });

            return { message: 'success' };
        } catch (err) {
            return err;
        }
    },
    countUsersInDepartment: async () => {
        try {
            const departments = await prisma.department.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            users: true
                        }
                    }
                }
            });

            return { departments: departments };
        } catch (err) {
            return err;
        }
    }
}