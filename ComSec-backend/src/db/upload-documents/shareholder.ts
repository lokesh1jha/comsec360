import prisma from "../../config/prisma";

export const getShareholderDocumentsDb = async (shareholderId: number, comapnyId: number) => {
    const [shareholderDocuments, documents, company] = await Promise.all([
        prisma.shareholder.findUnique({ where: { id: shareholderId } }),
        prisma.document.findMany({ where: { companyId: comapnyId } }),
        prisma.company.findUnique({ where: { id: comapnyId } })
    ]);
    return { shareholderDocuments, documents, company };
}