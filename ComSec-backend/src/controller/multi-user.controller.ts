import { Request, Response } from "express";
import { getDashboardCountService, getProjectsService, getProjectUserDetails } from "../services/multi-user.service";
import { generatePresignedUrl } from "../utils/s3Upload";
import { getDocumnetsByProjectId } from "../db/multi-user";

/*
export const getCompaniesController = async (req: Request, res: Response) => {
    try {
        const { incorporationStartDate, incorporationEndDate, annualReturnStartDate, annualReturnEndDate, financialStartDate, financialEndDate, page, pageSize } = req.query;
        const companies = await getCompaniesService(
            incorporationStartDate as string,
            incorporationEndDate as string,
            annualReturnStartDate as string,
            annualReturnEndDate as string,
            financialStartDate as string,
            financialEndDate as string,
            parseInt(page as string),
            parseInt(pageSize as string)
        );
        if(companies.companies.length === 0) {
            res.status(404).json({ error: 'No companies found' });
            return;
        }
        res.status(200).json({data: companies, message: 'Companies fetched successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
*/


export const getDashboardCountController = async (req: Request, res: Response) => {
    try {

        const userId = req.body.loggedInUser.id;

        const dashboardCount = await getDashboardCountService(userId);

        res.status(200).json({ data: dashboardCount, message: 'Dashboard count fetched successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const userId = req.body.loggedInUser.id;
        console.log("userId", userId, req.query);
        const { filterText, projectStartDateFrom, projectStartDateTo, processedBy, completedDateFrom, completedDateTo } = req.query;
        const projects = await getProjectsService(
            userId as string,
            filterText as string,
            projectStartDateFrom as string,
            projectStartDateTo as string,
            processedBy as string,
            completedDateFrom as string,
            completedDateTo as string
        );
        if (projects.projects.length === 0) {
            res.status(404).json({ error: 'No projects found' });
            return;
        }
        const formattedProjects = projects.projects.map((project: typeof projects.projects[0]) => ({
            id: "" + project.id,
            status: project.status,
            company: project.nameEnglish ?? project.nameChinese,
            project: project.projectType,
            start: Date.parse(project.createdAt.toDateString()), // to be changed
            due: Date.parse(project.createdAt.toDateString()), // to be changed
            published: "2", // publised number of documents
            processBy: project.nameEnglish
        }));

        res.status(200).json({ data: projects, message: 'Projects fetched successfully', formattedProjects });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


export const getProjectDetailsController = async (req: Request, res: Response) => {
    try {
        const userId = req.body.loggedInUser.id;
        const { projectId } = req.params;

        const userDetails = await getProjectUserDetails(
            userId as string,
            projectId as string
        );

        if (!userDetails) {
            res.status(404).json({ error: 'No projects found' });
            return;
        }


        const Shareholder = await Promise.all(userDetails.shareHolders.map(async (user: any, index: number) => {
            return {
                id: user.id,
                name: user.name,
                position: "Shareholder " + (index + 1),
                type: user.type,
                idProof: await generatePresignedUrl(user.idProof),
                addressProof: await generatePresignedUrl(user.addressProof),
                uploadType: user.NNC1Url ? "signed" : "unsigned",
                NNC1Url: await generatePresignedUrl(user.NNC1Url),
                ordinaryShareAgreementUrl: user.ordinaryShareAgreementUrl ? await generatePresignedUrl(user.ordinaryShareAgreementUrl) : "",
                
            }
        }));

        const director = await Promise.all(userDetails.directors.map(async (user: any, index: number) => {
            return {
                id: user.id,
                name: user.name,
                position: "Director " + (index + 1),
                type: user.type,
                idProof: await generatePresignedUrl(user.idProof),
                addressProof: await generatePresignedUrl(user.addressProof),
                uploadType: user.NNC1Url ? "signed" : "unsigned",
                NNC1Url: await generatePresignedUrl(user.NNC1Url),
                minutesUrl: user.minutesUrl ? await generatePresignedUrl(user.minutesUrl) : ""
            }
        }));

        const companySecretaryDetails = userDetails.companySecretary
        let companySecretary: { id: any; name: any; position: string; type: any; idProof: any; addressProof: any; uploadType: string; NNC1Url: any; minutesUrl: any; ordinaryShareAgreementUrl: any; } | null = null;

        if (companySecretaryDetails) {
            companySecretary = {
                id: companySecretaryDetails.id,
                name: companySecretaryDetails.name,
                position: "Company Secretary",
                type: companySecretaryDetails.type,
                idProof: await generatePresignedUrl(companySecretaryDetails.idProof),
                addressProof: await generatePresignedUrl(companySecretaryDetails.addressProof),
                uploadType: companySecretaryDetails.NNC1Url ? "signed" : "unsigned",
                NNC1Url: companySecretaryDetails.NNC1Url ? await generatePresignedUrl(companySecretaryDetails.NNC1Url) : "",
                minutesUrl: null,
                ordinaryShareAgreementUrl: null,
            }
        }

        // document status formatted as per the requirement
        const documents = await getDocumnetsByProjectId(userDetails.shareHolders[0].companyId);

        const shareHolderToNNC1 = userDetails.shareHolders.reduce((acc: any, shareholder: any) => {
            if (shareholder.NNC1Url && shareholder.NNC1Url !== "") acc[shareholder.id] = "signed";
            else acc[shareholder.id] = "unsigned";
            return acc;
        }, {});

        const shareHolderToOrdinaryShareAgreement = userDetails.shareHolders.reduce((acc: any, shareholder: any) => {
            if (shareholder.ordinaryShareAgreementUrl && shareholder.ordinaryShareAgreementUrl !== "") acc[shareholder.id] = "signed";
            else acc[shareholder.id] = "unsigned";
            return acc;
        }, {});

        const directorToNNC1 = userDetails.directors.reduce((acc: any, director: any) => {
            if (director.NNC1Url && director.NNC1Url !== "") acc[director.id] = "signed";
            else acc[director.id] = "unsigned";
            return acc;
        }, {});

        const directorToMinutes = userDetails.directors.reduce((acc: any, director: any) => {
            if (director.minutesUrl && director.minutesUrl !== "") acc[director.id] = "signed";
            else acc[director.id] = "unsigned";
            return acc;
        }, {});

        const signRequiredDocNames = ["NNC1 Form", "Ordinary Share Agreement", "Minutes"];
        const companySecretaryToNNC1 = userDetails.companySecretary ? (userDetails.companySecretary.NNC1Url ? "signed" : "unsigned") : null;

        const formattedDocuments = documents.map((doc: any) => {
            const status: any = {};

            userDetails.shareHolders.forEach((shareholder: any) => {
            status[shareholder.name] = {
                type: "shareholder",
                NNC1Form: shareHolderToNNC1[shareholder.id] || null,
                ordinaryshareagreement: shareHolderToOrdinaryShareAgreement[shareholder.id] || null,
            };
            });

            userDetails.directors.forEach((director: any) => {
            status[director.name] = {
                type: "director",
                NNC1Form: directorToNNC1[director.id] || null,
                minutes: directorToMinutes[director.id] || null
            };
            });

            if (userDetails.companySecretary) {
            status[userDetails.companySecretary.name] = {
                type: "companySecretary",
                NNC1Form: companySecretaryToNNC1
            };
            }

            return {
            id: doc.id,
            name: doc.name,
            url: doc.url,
            isSignedRequired: signRequiredDocNames.includes(doc.name),
            status
            };
        });
        const userDetailsFormatted = [...Shareholder, ...director];
        if (companySecretary !== null) {
            userDetailsFormatted.push(companySecretary);
        }
        // console.log("userDetails", userDetailsFormatted);

        res.status(200).json({ data: userDetailsFormatted, message: 'Projects fetched successfully', formattedDocuments});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

}