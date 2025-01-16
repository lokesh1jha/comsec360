import prisma from "../../config/prisma";
import logger from "../../utils/logger";

type ResponseType = {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
};
export const addShareHolderToCompany = async (shareHolder: any, companyId: number, userId: string): Promise<ResponseType> => {
    try {
        console.log("shareHolder shareDetails: ", shareHolder.shareDetails);
        if (typeof shareHolder.addressProof !== "string") {
            shareHolder.addressProof = '';
        }
        const newShareHolder = await prisma.shareholder.create({
            data: {
                type: shareHolder.type.toUpperCase(), // Person or Company
                idNo: shareHolder.idNo, // ID of the shareholder (Company ID or Personal ID)
                idProof: shareHolder.idProof, // ID proof document
                name: shareHolder.name, // Name of the shareholder
                surname: shareHolder.surname, // Surname (if applicable)
                address: shareHolder.address, // Address of the shareholder
                addressProof: shareHolder.addressProof, // Proof of address
                email: shareHolder.email, // Unique email address
                phone: shareHolder.phone, // Contact phone number
                sharesDetails: shareHolder.shareDetails, // JSON data for shares details
                companyId: companyId, // Foreign key linking to the company
            },
        });
        logger.info("Shareholder added successfully", newShareHolder);
        return {
            success: true,
            message: "Shareholder added successfully",
            data: newShareHolder,
        };
    } catch (error: any) {
        console.error("Error adding shareholder:", error);
        return {
            success: false,
            message: "Failed to add shareholder",
            error: error.message,
        };
    }
};

export const updateShareHolderInDB = async (shareHolder: any, companyId: number, userId: string): Promise<ResponseType> => {
    try {
        console.log("shareHolder shareDetails: ", shareHolder.shareDetails);
        if (typeof shareHolder.addressProof !== "string") {
            shareHolder.addressProof = '';
        }
        const updatedShareHolder = await prisma.shareholder.update({
            where: { email_companyId: { email: shareHolder.email, companyId: companyId } }, // Composite unique constraint
            data: {
                name: shareHolder.name,
                address: shareHolder.address,
                phone: shareHolder.phone,
                sharesDetails: shareHolder.shareDetails,
                email: shareHolder.email,
            },
        });
        logger.info("Shareholder updated successfully", updatedShareHolder);
        return {
            success: true,
            message: "Shareholder updated successfully",
            data: updatedShareHolder,
        };
    } catch (error: any) {
        console.error("Error updating shareholder:", error);
        return {
            success: false,
            message: "Failed to update shareholder",
            error: error.message,
        };
    }
};


export const getShareHoldersFromDb = async (companyId: number) => {
    return await prisma.shareholder.findMany({
        where: { companyId: companyId },
    });
}

export const getShareHoldersById = async (id: number) => {
    return await prisma.shareholder.findFirst({
        where: { id },
    });
};
export const getDirectorById = async (id: number) => {
    return await prisma.director.findFirst({
        where: { id },
    });
};
export const getCompanySecretaryById = async (id: number) => {
    return await prisma.companySecretary.findFirst({
        where: { id },
    });
};

export const deleteCompanyShareHolderFromDb = async ( companyId: number, shareHolderId: number): Promise<any> => {
    try {
        const deletedShareHolder = await prisma.shareholder.deleteMany({
            where: {
                id: shareHolderId,
                companyId: companyId,
            },
        });
        if (deletedShareHolder.count === 0) {
            return {
                success: false,
                message: "Shareholder not found or already deleted",
            };
        }
        logger.info("Shareholder deleted successfully", { shareHolderId, companyId });
        return {
            success: true,
            message: "Shareholder deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting shareholder:", error);
        return {
            success: false,
            message: "Failed to delete shareholder",
            error: error.message,
        };
    }
};

export const saveShareholderInviteInDb = async (inviteData: any) => {
    console.log("inviteData: shareholder", inviteData);

    const { email, otp, linkExpiry, invitedByUserId, ...rest } = inviteData;

    return await prisma.shareholderInvite.upsert({
        where: { email_companyId: { email, companyId: rest.companyId } }, // Composite unique constraint
        update: {
            otp: otp,
            linkExpiry: linkExpiry,
            updatedAt: new Date(),
        },
        create: {
            email: email,
            otp: otp,
            linkExpiry: linkExpiry,
            invitedByUserId: invitedByUserId,
            ...rest,
        },
    });
};
