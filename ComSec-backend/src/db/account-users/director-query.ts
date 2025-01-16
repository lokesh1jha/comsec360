import prisma from "../../config/prisma";
import logger from "../../utils/logger";

export const addDirectorInDB = async (director: any, companyId: number): Promise<any> => {
    try {
        console.log("Adding director: ", director, companyId);
        if(typeof director.addressProof != 'string') {
            director.addressProof = '';
        }
        const newDirector = await prisma.director.create({
            data: {
                type: director.type.toUpperCase(),
                idNo: director.idNo,
                idProof: director.idProof,
                name: director.name,
                surname: director.surname,
                address: director.address,
                addressProof: director.addressProof,
                email: director.email,
                phone: director.phone,
                companyId: companyId,
            },
        });
        logger.info("Director added successfully", newDirector);
        return {
            success: true,
            message: "Director added successfully",
            data: newDirector,
        };
    } catch (error: any) {
        console.error("Error adding director:", error);
        return {
            success: false,
            message: "Failed to add director",
            error: error.message,
        };
    }
}

export const updateDirectorInDB = async (director: any, comapnyId: number): Promise<any> => {
    try {
        console.log("Updating director: ", director);
        const updatedDirector = await prisma.director.update({
            where: { email_companyId: { email: director.email, companyId: comapnyId } },
            data: {
                name: director.name,
                address: director.address,
                email: director.email,
                phone: director.phone,
            },
        });
        logger.info("Director updated successfully", updatedDirector);
        return {
            success: true,
            message: "Director updated successfully",
            data: updatedDirector,
        };
    } catch (error: any) {
        console.error("Error updating director:", error);
        return {
            success: false,
            message: "Failed to update director",
            error: error.message,
        };
    }
}

export const getDirectorsFromDb = async (comapnyId: number): Promise<any> => {
    return await prisma.director.findMany({
        where: { companyId: comapnyId },
    });
}

export const saveDirectorsInviteInDb = async (inviteData: any) => {
    console.log("inviteData: directors", inviteData);

    const { email, otp, linkExpiry, companyId, ...rest } = inviteData;

    return await prisma.directorInvite.upsert({
        where: { email_companyId: { email, companyId } }, 
        update: {
            otp: otp,
            linkExpiry: linkExpiry,
            updatedAt: new Date(),
        },
        create: {
            email: email,
            otp: otp,
            linkExpiry: linkExpiry,
            companyId: companyId,
            ...rest,
        },
    });
};



export const deleteCompanyDirectorFromDb = async (companyId: number, directorId: number): Promise<any> => {
    return await prisma.director.deleteMany({
        where: { companyId: companyId, id: directorId },
    });
}