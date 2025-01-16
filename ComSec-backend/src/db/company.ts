import prisma from "../config/prisma";


export const getCompanyStatus = async (companyId: number) =>  {
    try {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: { status: true },
        });
        return company?.status;
    } catch (error) {
        console.error('Error fetching company status:', error);
        throw error;
    }
}


export const updateCompanyStatusDB = async (companyId: number, newStatus: "started" | "in_progress" | "completed") => {
    let response = { success: true, error: {}, data: {} };
    try {
        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: { status: newStatus },
        });
        response.data = updatedCompany;
        return response;
    } catch (error: any) {
        console.error('Error updating company status:', error);
        response.success = false;
        response.error = error;
        return response;
    }
}

export const listPendingShareHolderInvites = async (companyId: number) => {
    try {
        const shareHolderInvite = await prisma.shareholderInvite.findMany({
            where: { companyId, shareholderId: null },
        });
        return shareHolderInvite;
    } catch (error) {
        console.error('Error fetching share holder invites:', error);
        throw error;
    }
}

export const listPendingDirectorInvites = async (companyId: number) => {
    try {
        const directorInvite = await prisma.directorInvite.findMany({
            where: { companyId, directorId: null },
        });
        return directorInvite;
    } catch (error) {
        console.error('Error fetching director invites:', error);
        throw error;
    }
}

export const getDocumentsByCompanyId = async (companyId: number) => {
    try {
        const documents = await prisma.document.findMany({
            where: { companyId },
        });
        return documents;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}