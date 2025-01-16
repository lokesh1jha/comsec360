import prisma from "../config/prisma";
import logger from "../utils/logger";

export const insertUser = async (user: any) => {
    const { email, type } = user;

    // Validate unique email for specific types
    if (['account_user', 'admin'].includes(type)) {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
                type: { in: ['account_user', 'admin'] },
            },
        });

        if (existingUser) {
            throw new Error(
                `Email "${email}" is already in use for type "${existingUser.type}".`
            );
        }
    }

    // Proceed with user creation
    try {
        return await prisma.user.create({
            data: user,
        });
    } catch (error) {
        console.error("Error inserting user:", error);
        throw new Error("Failed to create user.");
    }
};

export const updateAccountUser = async (user: any) => {
    try {
        return await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                updatedAt: new Date()
            },
        });
    } catch (error) {
        logger.error("Error occured in updateAccountUser service: ", error);
        throw error;
    }
};


export const getAccountUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            type: true,
            createdAt: true
        },
        where: {
            type: "account_user"
        },
        orderBy: {
            createdAt: "desc",
        }
    });
};


export const getUsersCountByType = async (type: string): Promise<number> => {
    return await prisma.user.count({
        where: {
            type: type as "admin" | "account_user" | "guest",
        },
    });
}

export const getUsersByEmail = async (email: string) => {
    return await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
}


export const getUsersById = async (id: string) => {
    return await prisma.user.findFirst({
        where: {
            id: id,
        },
    });
}

export const deleteUserById = async (id: string) => {
    return await prisma.user.delete({
        where: {
            id: id,
        },
    });
}


export const getShareholderByEmail = async (email: string, comapnyId: number) => {
    return await prisma.shareholder.findFirst({
        where: {
            email: email,
            companyId: comapnyId
        },
    });
}

export const getDirectorByEmail = async (email: string, comapnyId: number) => {
    return await prisma.director.findFirst({
        where: {
            email: email,
            companyId: comapnyId
        },
    });
}