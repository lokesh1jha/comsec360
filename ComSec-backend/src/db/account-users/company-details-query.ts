import prisma from "../../config/prisma";

export const insertCompanyDetailsInDb = async (company: any): Promise<any> => {
    const {
        name, chiname, type, code, nature, house, building, street, district, country,
        email, companyTel, companyfax, time, presentorName, presentorChiName,
        presentorAddress, presentorTel, presentorFax, presentorEmail, presentorReferance, companyLogo, loggedInUser
    } = company;

    return await prisma.company.create({
        data: {
            nameEnglish: name,
            nameChinese: chiname,
            type: type.toUpperCase(), // Ensure type matches enum (e.g., "PRIVATE" or "PUBLIC")
            code,
            natureOfBusiness: nature,
            email,
            telephone: companyTel,
            fax: companyfax,
            businessFee: time === "1 year" ? "ONE_YEAR" : "THREE_YEARS", // Map `time` to enum
            address: {
                create: {
                    flatFloor: house,
                    building,
                    street,
                    district,
                    city: country,
                },
            },
            presentorReference: {
                create: {
                    nameEnglish: presentorName,
                    nameChinese: presentorChiName,
                    address: presentorAddress,
                    telephone: presentorTel,
                    fax: presentorFax,
                    email: presentorEmail,
                    phoneNumber: presentorTel,
                    presentorsReferance: presentorReferance,
                    logo: companyLogo,
                },
            },
            logo: companyLogo,
            user: {
                connect: { id: loggedInUser.id }, 
            }
        },
    });
};


export const updateCompanyDetails = async (company: any, companyId: number): Promise<any> => {
    const {
        name, chiname, type, code, nature, house, building, street, district, country,
        email, companyTel, companyfax, time, presentorName, presentorChiName,
        presentorAddress, presentorTel, presentorFax, presentorEmail, presentorReferance, companyLogo
    } = company;

    const updateData: any = {
        nameEnglish: name,
        nameChinese: chiname,
        type: type.toUpperCase(),
        code,
        natureOfBusiness: nature,
        email,
        telephone: companyTel,
        fax: companyfax,
        businessFee: time === "1 year" ? "ONE_YEAR" : "THREE_YEARS",
        address: {
            update: {
                flatFloor: house,
                building,
                street,
                district,
                city: country,
            },
        },
        presentorReference: {
            update: {
                nameEnglish: presentorName,
                nameChinese: presentorChiName,
                address: presentorAddress,
                telephone: presentorTel,
                fax: presentorFax,
                email: presentorEmail,
                phoneNumber: presentorTel,
                presentorsReferance: presentorReferance,
            },
        },
    };

    if (companyLogo) {
        updateData.logo = companyLogo;
        updateData.presentorReference.update.logo = companyLogo;
    }

    return await prisma.company.update({
        where: {
            id: companyId, // The ID of the company to update
        },
        data: updateData,
    });

}

export const getCompanyDetailsFromDb = async (companyId: number): Promise<any> => {
    return await prisma.company.findUnique({
        where: { id: companyId },
        include: {
            address: true, // Include related address details
            presentorReference: true, // Include related presentor details
        },
    });
}


export const getCompanyCountFromDb = async (userId: string): Promise<any> => {
    return await prisma.company.count({
        where: { userId: userId },
    });
}

export const updateCompanyLogoInDb = async (companyLogo: string, companyId: number): Promise<any> => {
    return await prisma.company.update({
        where: { id: companyId },
        data: { logo: companyLogo },
    });
}

export const insertCompanyShareCapitalInDb = async (shareCapital: any, companyId: number, userId: string): Promise<any> => {
    try {
        console.log("shareCapital: ", shareCapital, "companyId: ", companyId, "userId: ", userId);
        // Create the ShareCapital record in the database
        const newShareCapital = await prisma.shareCapital.create({
            data: {
                companyId: companyId, // Foreign key to Company
                userId: userId, // User ID associated with the share capital
                class: shareCapital.class, // Share class (e.g., "A", "B", etc.)
                totalProposed: shareCapital.totalProposed, // Total shares proposed
                currency: shareCapital.currency, // Currency for the share price (e.g., USD, INR)
                unitPrice: shareCapital.unitPrice, // Price per share
                total: shareCapital.total, // Total value (unitPrice * totalProposed)
                paid: shareCapital.paid, // Amount paid
                unpaid: shareCapital.unpaid, // Amount unpaid
                rightsAttached: shareCapital.rightsAttached ?? "Voting Rights", // Rights attached to the share (e.g., "Voting", "Dividend")
            },
        });

        return newShareCapital;
    } catch (error) {
        console.error("Error inserting share capital:", error);
        throw new Error("Could not insert the share capital record.");
    }
};

export const updateShareCapitalInDb = async (shareCapital: any, shareCapitalId: number, userId: string): Promise<any> => {
    try {
        // Update the ShareCapital record in the database
        const updatedShareCapital = await prisma.shareCapital.update({
            where: {
                id: shareCapitalId, 
                companyId: shareCapital.companyId, 
                userId: userId
            },
            data: {
                class: shareCapital.class, // Share class (e.g., "A", "B", etc.)
                totalProposed: shareCapital.totalProposed, // Total shares proposed
                currency: shareCapital.currency, // Currency for the share price (e.g., USD, INR)
                unitPrice: shareCapital.unitPrice, // Price per share
                total: shareCapital.total, // Total value (unitPrice * totalProposed)
                paid: shareCapital.paid, // Amount paid
                unpaid: shareCapital.unpaid, // Amount unpaid
                rightsAttached: shareCapital.rightsAttached ?? "Voting Rights", // Rights attached to the share (e.g., "Voting", "Dividend")
            },
        });

        return updatedShareCapital;
    } catch (error) {
        console.error("Error updating share capital:", error);
        throw new Error("Could not update the share capital record.");
    }
}

export const getShareCapitalFromDb = async (companyId: number) => {
    return await prisma.shareCapital.findMany({
        where: { companyId: companyId },
    });
}


export const deleteShareCapitalFromDb = async (shareCapitalId: number, companyId: number, userId: string) => {
    return await prisma.shareCapital.delete({
        where: { id: shareCapitalId, companyId: companyId, userId: userId },
    });
}


export const getIRBRILinkFromDb = async () => {
    return await prisma.config.findFirst({
        where: { key: "IRBRI" },
    });
}