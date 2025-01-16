import prisma from "../config/prisma";

/* Companies Will be added in future
export const getCompaniesWithFilter = async (
    incorporationStartDate: string,
    incorporationEndDate: string,
    annualReturnStartDate: string,
    annualReturnEndDate: string,
    financialStartDate: string,
    financialEndDate: string,
    page: number,
    pageSize: number
) => {
    const whereClause: any = {};

    if (incorporationStartDate && incorporationEndDate) {
        whereClause.incorporationDate = {
            gte: new Date(incorporationStartDate),
            lte: new Date(incorporationEndDate),
        };
    }

    if (annualReturnStartDate && annualReturnEndDate) {
        whereClause.annualReturnDate = {
            gte: new Date(annualReturnStartDate),
            lte: new Date(annualReturnEndDate),
        };
    }

    if (financialStartDate && financialEndDate) {
        whereClause.financialYearEnd = {
            gte: new Date(financialStartDate),
            lte: new Date(financialEndDate),
        };
    }

    const companies = await prisma.company.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            nameEnglish: 'asc',
                },
            },
        },
    });

    const totalCompanies = await prisma.company.count({
        where: whereClause,
    });

    return {
        companies,
        totalCompanies,
        totalPages: Math.ceil(totalCompanies / pageSize),
        currentPage: page,
    };
};

export const getAllCompanies = async (page: number, pageSize: number) => {
    const companies = await prisma.company.findMany({
        orderBy: {
            nameEnglish: 'asc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });

    const totalCompanies = await prisma.company.count();

    return {
        companies,
        totalCompanies,
        totalPages: Math.ceil(totalCompanies / pageSize),
        currentPage: page,
    };
};
*/

export const getAllProjects = async (userId: string) => {
    const projects = await prisma.company.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            nameEnglish: 'asc',
        }
    });

    const totalProjects = await prisma.company.count();
    console.log("totalProjects", totalProjects, projects);
    return {
        projects,
        totalProjects
    };
};

export const getProjectsWithFilter = async (
    userId: string,
    filterText: string,
    projectStartDateFrom: string,
    projectStartDateTo: string,
    processedBy: string,
    completedDateFrom: string,
    completedDateTo: string
) => {
    const whereClause: any = {};

    if (userId) {
        whereClause.userId = userId;
    }

    if (filterText) {
        whereClause.name = {
            contains: filterText,
            mode: 'insensitive',
        };
    }

    if (projectStartDateFrom && projectStartDateTo) {
        whereClause.startDate = {
            gte: new Date(projectStartDateFrom),
            lte: new Date(projectStartDateTo),
        };
    }

    if (processedBy) {
        whereClause.processedBy = processedBy;
    }

    if (completedDateFrom && completedDateTo) {
        whereClause.completedDate = {
            gte: new Date(completedDateFrom),
            lte: new Date(completedDateTo),
        };
    }

    const projects = await prisma.company.findMany({
        where: whereClause,
        orderBy: {
            nameEnglish: 'asc',
        },
    });

    const totalProjects = await prisma.company.count({
        where: whereClause,
    });

    return {
        projects,
        totalProjects,
    };
};

export const getCompaniesByIdAndStatus = async (userId: string) => {
    const companies = await prisma.company.findMany({
        where: {
            userId: userId,
        },
        select: {
            status: true,
        },
    });

    const statusCount = companies.reduce((acc: { [key: string]: number }, company: any) => {
        acc[company.status] = (acc[company.status] || 0) + 1;
        return acc;
    }, {});

    return statusCount;
};

export const getMultiUserDashboardCountFromDb = async (companyId: number) => {
    return await prisma.company.findMany({
        where: {
            id: companyId,
        },
        select: {
            status: true,
        },
    });
}


export const projectUserDetailsDb = async (userId: string, projectId: string) => {
    return await prisma.company.findFirst({
        where: {
            userId: userId,
            id: parseInt(projectId),
        },
        include: {
            shareHolders: true,
            directors: true,
            companySecretary: true,
        }
    });
}


export const getCompanyDetailedInfo = async (companyId: number) => {

    return await prisma.company.findUnique({
        where: {
            id: companyId,
        },
        include: {
            address: true,
            presentorReference: true,
            shares: true,
            shareHolders: true,
            directors: true,
            companySecretary: true,
            document: true
        },
    });
} 

// the names should not be chaged when deployed
const DocumentType = [
    'NNC1 Form',
    'Article of Association (A & A)',
    'Ordinary Share Agreement',
    'Minutes',
    'IRBRI',
];

  
export const saveDocsToDb = async (docs: any) => {
    const { companyId, NNC1_Form, OrdinaryShareAggrement, Minutes, ArticleofAssociation, IRBRI } = docs;
 
      // create object for bulk insert
    const data: Array<{ name: string, url: string, companyId: number }> = [
        {
            name: DocumentType[0],
            url: NNC1_Form,
            companyId: companyId
        },
        {
            name: DocumentType[1],
            url: ArticleofAssociation,
            companyId: companyId
        },
        {
            name: DocumentType[2],
            url: OrdinaryShareAggrement,
            companyId: companyId
        },
        {
            name: DocumentType[3],
            url: Minutes,
            companyId: companyId
        },
        {
            name: DocumentType[4],
            url: IRBRI,
            companyId: companyId
        }
    ];
    for (const doc of data) {
        await prisma.document.upsert({
            where: {
                name_companyId: {
                    name: doc.name,
                    companyId: doc.companyId,
                },
            },
            update: {
                url: doc.url,
            },
            create: {
                name: doc.name,
                url: doc.url,
                company: {
                    connect: {
                        id: doc.companyId,
                    }
                },
            },
        })
    }

};


export const getCompanyIdByUserId = async (userId: string) => {
    const companies = await prisma.company.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
        },
    });

    return companies.map((company: any) => company.id);
};

export const saveNNC1FormLinkToShareHolder = async (shareHolderId: number, NNC1Url: string) => {
    return await prisma.shareholder.update({
        where: {
            id: shareHolderId,
        },
        data: {
            NNC1Url: NNC1Url,
        },
    });
}

export const saveNNC1FormLinkToDirector = async (directorId: number, NNC1Url: string) => {
    return await prisma.director.update({
        where: {
            id: directorId,
        },
        data: {
            NNC1Url: NNC1Url,
        },
    });
}

export const saveNNC1FormLinkToCompanySecretary = async (companySecretaryId: number, NNC1Url: string) => {
    return await prisma.companySecretary.update({
        where: {
            id: companySecretaryId,
        },
        data: {
            NNC1Url: NNC1Url,
        },
    });
}

export const getShareDetailsByShareHolderId = async (shareHolderId: number) => {
    return await prisma.shareholder.findUnique({
        where: {
            id: shareHolderId,
        },
        select: {
            sharesDetails: true,
        },
    });
}
export const updateShareCertificate = async (shareHolderId: number, sharesDetails: any) => {
    
    return await prisma.shareholder.update({
        where: {
            id: shareHolderId,
        },
        data: {
            sharesDetails
        },
    });
} 


export const getDocumnetsByProjectId = async (projectId: number) => {
    return await prisma.document.findMany({
        where: {
            companyId: projectId,
        },
    });
}