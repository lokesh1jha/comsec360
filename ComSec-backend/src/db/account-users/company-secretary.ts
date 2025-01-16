import prisma from "../../config/prisma";


export const addOrUpdateSecretary = async (secretary: any, companyId: number, userId: string) => {
    console.log("secretary: ", secretary, companyId, userId);

    secretary.type = secretary.type.toUpperCase(); 
    secretary.companyId = companyId;
    delete secretary.loggedInUser;
    if(!secretary.tcspReason){
        secretary.tcspReason = '';
    }
    if(typeof secretary.addressProof != 'string') {
        secretary.addressProof = '';
    }

    return await prisma.companySecretary.upsert({
        where: { companyId: companyId }, // Ensure only one secretary per company
        update: {
            ...secretary, // Update fields
            // updatedAt: new Date(), // If you want to track updates
        },
        create: {
            ...secretary, // Create a new secretary if none exists
        },
    });
};

export const getSecretaryFromDb = async (comapnyId: number) => {
    return await prisma.companySecretary.findUnique({
        where: { companyId: comapnyId },
    });
}


export const saveGovermentDocumentsInDb = async (documents: any, companyId: number) => {

    return await prisma.company.update({
        where: { id: companyId },
        data: {
            incorporationDate: documents.incorporationDate,
            certificateOfIncorporationUrl: documents.certificateOfIncorporationUrl,
            registrationNumber: documents.registrationNumber,
            registrationNoticeUrl: documents.registrationNoticeUrl,
            receiptUrl: documents.receiptUrl
        }
    });
};


export const changePasswordInDb = async (userId: string, newPassword: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            password: newPassword,
        },
    });
};