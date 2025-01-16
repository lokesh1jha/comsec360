import prisma from "../../config/prisma";

export const getdirectorDocumentsDb = async (directorId: number, comapnyId: number) => {
    const [directorDocuments, documents, company] = await Promise.all([
        prisma.director.findUnique({ where: { id: directorId } }),
        prisma.document.findMany({ where: { companyId: comapnyId } }),
        prisma.company.findUnique({ where: { id: comapnyId } })
    ]);
    return { directorDocuments, documents, company };
}



export const updateDocumentDb = async (documentData: { name: string, companyId: number, url: string }) => {
    const newDocument = await prisma.document.update({
        where: { name_companyId: { name: documentData.name, companyId: documentData.companyId } },
        data: {
            url: documentData.url
        }
    });
    return newDocument;
}


export const updateToShareHolderTable = async (shareholderData: { id: number, companyId: number, url: string }) => {
    const updatedShareholder = await prisma.shareholder.update({
        where: { id: shareholderData.id, companyId: shareholderData.companyId },
        data: {
            ordinaryShareAgreementUrl: shareholderData.url
        }
    });
    return updatedShareholder;
}


export const updateToDirectorTable = async (directorData: { id: number, companyId: number, url: string }) => {
    const updatedDirector = await prisma.director.update({
        where: { id: directorData.id, companyId: directorData.companyId },
        data: {
            minutesUrl: directorData.url
        }
    });
    return updatedDirector;
}