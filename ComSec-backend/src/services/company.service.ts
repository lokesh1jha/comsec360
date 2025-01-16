import { getIRBRILinkFromDb } from "../db/account-users/company-details-query";
import { getCompanyStatus, listPendingDirectorInvites, listPendingShareHolderInvites, updateCompanyStatusDB } from "../db/company";
import { getCompanyDetailedInfo, getShareDetailsByShareHolderId, saveDocsToDb, updateShareCertificate } from "../db/multi-user";
import { generateArticleOfAssociationPDF } from "../utils/documents/ArticleofAssociation/ArticleofAssociation";
import { generateMinutesofMeetingPDF } from "../utils/documents/Minutes/MinutesofMeeting";
import { fillNNC1Form } from "../utils/documents/NNC1_Form/fill_NNC1_Form";
import { generateOrdinaryShareAgreementPDF, OrdinaryShareAgreementType } from "../utils/documents/OrdinaryShareAgreement/OrdinaryShareAgreement";
import { fillShareCertificate } from "../utils/documents/ShareCertificate/shareCertificate";
import { sendEmail } from "../utils/email/sendEmail";
import { getDocumentSignedTemplate } from "../utils/email/templates/NNC1-form-signature";
import { generateDirectorSignatureLink, generateShareHolderSignatureLink } from "../utils/inviteLink";
import { generateToken } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { generatePresignedUrl } from "../utils/s3Upload";
import uploadPdfToS3 from "../utils/uploadToS3/upload";

type DocsObjectType = {
    companyId: number,
    NNC1_Form: string,
    OrdinaryShareAggrement: string,
    Minutes: string,
}
type StandardResponseInerface = {
    success: boolean;
    data: DocsObjectType | null;
    fullInfoOnCompany: any;
    error: any;
}

const generateNNC1Form = async (getFullInfoOnCompany: any) => {
    return await fillNNC1Form(getFullInfoOnCompany);
};

const generateOrdinaryShareAggrement = async (getFullInfoOnCompany: any) => {
    const { createdAt, shareHolders, shares } = getFullInfoOnCompany;
    const totalShares = shares.reduce((acc: number, share: any) => acc + share.totalProposed, 0);
    const shareClassDetails = shares.reduce((acc: any, share: any) => {
        if (!acc[share.class]) {
            acc[share.class] = {
                unitPrice: share.unitPrice,
                currency: share.currency,
                totalProposed: share.totalProposed,
                total: share.total
            };
        }
        return acc;
    }, {});

    const OrdinaryShareAggrementData: OrdinaryShareAgreementType = {
        effectiveDate: new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        parties: shareHolders.map((shareHolder: any) => {
            const shareDetails = shareHolder.sharesDetails.map((share: any) => {
                return {
                    shares: `${((share.noOfShares / totalShares) * 100).toFixed(1)}%`,
                    sharesHeld: share.noOfShares,
                    consideration: `${shareClassDetails[share.classOfShares].currency} ${share.noOfShares}`,
                    pricePerShare: `${shareClassDetails[share.classOfShares].currency} ${(shareClassDetails[share.classOfShares].unitPrice).toFixed(2)}`
                };
            });
            const combinedConsideration: string = shareDetails.map((detail: { consideration: string }) => detail.consideration).join('<br>');
            const combinedPricePerShare: string = shareDetails.map((detail: { pricePerShare: string }) => detail.pricePerShare).join('<br>');

            return {
                name: shareHolder.name,
                shares: `${(shareDetails.reduce((acc: any, detail: { sharesHeld: any; }) => acc + detail.sharesHeld, 0) / totalShares * 100).toFixed(2)}%`,
                role: shareHolder.role || '',
                sharesHeld: shareDetails.reduce((acc: any, detail: { sharesHeld: any; }) => acc + detail.sharesHeld, 0),
                consideration: combinedConsideration,
                pricePerShare: combinedPricePerShare,
                idNo: shareHolder.idNo
            };
        }),
        totalShares: shares.reduce((acc: number, share: any) => acc + share.totalProposed, 0),
        totalPaidUp: `${shares[0].currency} ${shares.reduce((acc: number, share: any) => acc + share.total, 0)}`
    };
    return await generateOrdinaryShareAgreementPDF(OrdinaryShareAggrementData)
};

const generateMinutesofMeeting = async (getFullInfoOnCompany: any) => {
    const { createdAt, shareHolders, presentorReference } = getFullInfoOnCompany;

    const MinutesofMeetingData = {
        companyNumber: getFullInfoOnCompany.id,
        companyName: getFullInfoOnCompany.nameEnglish,
        companyChineseName: getFullInfoOnCompany.nameChinese,
        companyLogo: getFullInfoOnCompany.logo ? await generatePresignedUrl(getFullInfoOnCompany.logo) : '',
        date: "24-20/7",
        time: "10:00 AM",
        place: "Park Street, Eastern District, Hong Kong",
        present: presentorReference ? [presentorReference.nameEnglish] : [],
        chairman: presentorReference ? presentorReference.nameEnglish : "",
        incorporationDate: new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        founders: shareHolders.map((shareHolder: any) => ({
            name: shareHolder.name,
            shares: `${shareHolder.sharesDetails.map((share: any) => `${share.noOfShares} ${share.classOfShares}`).join(', ')}`
        })),
        registeredOffice: getFullInfoOnCompany.address.street,
        registersLocation: getFullInfoOnCompany.address.street,
        chairmanSignature: "             ",
        footer: getFullInfoOnCompany.nameEnglish
    };
    return await generateMinutesofMeetingPDF(MinutesofMeetingData);
};

const generateArticleofAssociation = async (getFullInfoOnCompany: any) => {
    const { nameEnglish, nameChinese, shareHolders, shares } = getFullInfoOnCompany;
    const shareClassDetails = shares.reduce((acc: any, share: any) => {
        if (!acc[share.class]) {
            acc[share.class] = {
                unitPrice: share.unitPrice,
                currency: share.currency,
                totalProposed: share.totalProposed,
                total: share.total
            };
        }
        return acc;
    }, {});
    const ArticleofAssociationData = {
        englishName: nameEnglish,
        chineseName: nameChinese,
        shareCapitalDetails: shareHolders.map((shareHolder: any) => {
            return {
                shareCapital: shareClassDetails[shareHolder.sharesDetails[0].classOfShares].total,
                sharesIssued: shareHolder.sharesDetails[0].noOfShares,
                founderName: shareHolder.name,
                shareAmount: shareClassDetails[shareHolder.sharesDetails[0].classOfShares].unitPrice * shareHolder.sharesDetails[0].noOfShares,
            };
        })
    };
    return await generateArticleOfAssociationPDF(ArticleofAssociationData);
};

const getIRBRILink = async () => {
    const IRBRI = await getIRBRILinkFromDb();
    return IRBRI ? IRBRI.value : "";
};

const uploadDocuments = async (companyId: number, documents: any[]) => {
    const [NNC1_Form, OrdinaryShareAggrement, Minutes, ArticleofAssociation] = documents;
    return await Promise.all([
        uploadPdfToS3(NNC1_Form, `company_documents/${companyId}`, `NCC1_Form.pdf`),
        uploadPdfToS3(OrdinaryShareAggrement, `company_documents/${companyId}`, `OrdinaryShareAggrement.pdf`),
        uploadPdfToS3(Minutes, `company_documents/${companyId}`, `Minutes.pdf`),
        uploadPdfToS3(ArticleofAssociation, `company_documents/${companyId}`, `ArticleofAssociation.pdf`)
    ]);
};

export const generateAllDocData = async (companyId: number) => {
    let response: StandardResponseInerface = { success: false, data: null, fullInfoOnCompany: null, error: null };
    try {
        const getFullInfoOnCompany = await getCompanyDetailedInfo(companyId);
        if (!getFullInfoOnCompany) {
            response.error = "Company Not found";
            return response;
        }
        console.log(getFullInfoOnCompany)
        const [NNC1_Form, OrdinaryShareAggrement, Minutes, ArticleofAssociation, IRBRI, shareCertificates] = await Promise.all([
            generateNNC1Form(getFullInfoOnCompany),
            generateOrdinaryShareAggrement(getFullInfoOnCompany),
            generateMinutesofMeeting(getFullInfoOnCompany),
            generateArticleofAssociation(getFullInfoOnCompany),
            getIRBRILink(),
            buildShareCertificate(companyId)
        ]);

        // console.log("shareCertificates made and uploading", shareCertificates)
        const [NNC1_Form_Location, OrdinaryShareAggrement_Location, Minutes_Location, ArticleofAssociation_Location] = await uploadDocuments(companyId, [NNC1_Form, OrdinaryShareAggrement, Minutes, ArticleofAssociation]);

        const docsToSave = {
            companyId,
            NNC1_Form: NNC1_Form_Location,
            OrdinaryShareAggrement: OrdinaryShareAggrement_Location,
            Minutes: Minutes_Location,
            ArticleofAssociation: ArticleofAssociation_Location,
            IRBRI
        };

        await saveDocsToDb(docsToSave);


        response.success = true;
        response.data = docsToSave
        response.fullInfoOnCompany = getFullInfoOnCompany
        return response
    } catch (error: Error | any) {
        logger.error("Error occured in generateAllDocData service: ", error);
        response.error = error;
        return response;
    }
};


export const sendNNC1Email = async (companyData: DocsObjectType, fullInfoOnCompany: any) => {
    const response: {
        success: boolean;
        error: any;
    } = { success: false, error: null };
    try {
        // list of emails of all the share holders and directors and secretary
        const ShareHolderEmailList: { name: string, email: string, surname: string, id: number, companyId: number }[] = fullInfoOnCompany.shareHolders.map(
            (shareHolder: any) => ({ name: shareHolder.name, email: shareHolder.email, surname: shareHolder.surname ?? '', id: shareHolder.id, companyId: shareHolder.companyId }));
        const DirectorEmailList: { name: string, email: string, surname: string, id: number, companyId: number }[] = fullInfoOnCompany.directors.map(
            (director: any) => ({ name: director.name, email: director.email, surname: director.surname ?? '', id: director.id, companyId: director.companyId }));
        const SecretaryEmailList: { name: string, email: string } = { name: fullInfoOnCompany.companySecretary.name, email: fullInfoOnCompany.companySecretary.email };

        const NNC1FormLink = await generatePresignedUrl(companyData.NNC1_Form, 3600 * 24 * 7);
        const OrdinaryShareAggrementLink = await generatePresignedUrl(companyData.OrdinaryShareAggrement, 3600 * 24 * 7);
        const MinutesLink = await generatePresignedUrl(companyData.Minutes, 3600 * 24 * 7);

        if (!NNC1FormLink || !OrdinaryShareAggrementLink || !MinutesLink) {
            throw new Error("Error generating pre-signed URL");
        }
        /*
        1) NNC1 form with all data gathered during creation of project. In this documents one page we have to get separate and sign for Share holders and one page sign for directors.
        2) Article of Association (No Sign needed) with all the data of shares info including class of shares, allotment price and so on.
        3) Ordinary Share Agreement (Sign of ShareHolder Needed) you need to display information as shown in sample.
        4) Minutes of Meeting (Sign of Directors is needed)
        */
        const SENDER_EMAIL = process.env.SENDER_EMAIL || 'lokesh9jha@gmail.com';

        // For Share Holders send email with NNC1 form only       
        for (const shareHolder of ShareHolderEmailList) {
            const shareholderToken = generateToken({ email: shareHolder.email, type: 'shareholder', firstname: shareHolder.name, lastname: shareHolder.surname, companyId: shareHolder.companyId }, "5d");
            const user = {
                id: shareHolder.id,
                email: shareHolder.email,
                name: shareHolder.name,
                surname: shareHolder.surname,
                type: 'shareholder'
            }
            const ShareHolderLink = generateShareHolderSignatureLink(companyData.companyId, shareholderToken, user);
            const emailBody = getDocumentSignedTemplate(shareHolder.name, [NNC1FormLink], ShareHolderLink);
            await sendEmail(emailBody, 'Sign and Revert the Documents', shareHolder.email, SENDER_EMAIL, 'Please find the attached documents for your review and signature. For Shareholder');
        }
        // For Ordinary Share Agreement and Minutes of Meeting send email to directors only
        for (const director of DirectorEmailList) {
            const directorToken = generateToken({ email: director.email, type: 'director', firstname: director.name, lastname: director.surname, companyId: director.companyId }, "5d");
            const user = {
                id: director.id,
                email: director.email,
                name: director.name,
                surname: director.surname,
                type: 'director'
            }
            const DirectorLink = generateDirectorSignatureLink(companyData.companyId, directorToken, user);
            const emailBody = getDocumentSignedTemplate(director.name, [NNC1FormLink], DirectorLink);
            await sendEmail(emailBody, 'Sign and Revert the Documents', director.email, SENDER_EMAIL, 'Please find the attached documents for your review and signature. For Director');
        }

        // For Secretary send email with NNC1 form only
        const emailBody = getDocumentSignedTemplate(SecretaryEmailList.name, [NNC1FormLink]);
        await sendEmail(emailBody, 'Sign and Revert the Documents', SecretaryEmailList.email, SENDER_EMAIL, 'Please find the attached documents for your review and signature. For Secretary');

        console.log('Email sent successfully');
        response.success = true;
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        response.error = error;
        return response;
    }
};


export const checkCompanyStatus = async (companyId: number) => {
    try {
        return await getCompanyStatus(companyId);
    } catch (error) {
        logger.error("Error occurred in checkCompanyStatus service: ", error);
        return null;
    }
};

export const updateCompanyStatus = async (companyId: number, status: "started" | "in_progress" | "completed") => {
    const response: { success: boolean, error: any, data: any } = { success: false, error: null, data: null };
    try {
        const result = await updateCompanyStatusDB(companyId, status);
        response.success = true;
        response.data = result;
        return response;
    } catch (error) {
        logger.error("Error occurred in updateCompanyStatus service: ", error);
        response.error = error;
        return response;
    }
};

export const checkShareHolderInviteJoined = async (companyId: number) => {
    const response: { success: boolean, error: any, data: any } = { success: false, error: null, data: [] };
    try {
        const pendingShareHolderInvites = await listPendingShareHolderInvites(companyId);
        if (pendingShareHolderInvites.length > 0) {
            response.success = true;
            response.data = pendingShareHolderInvites;
            return response;
        }

        return response;
    } catch (error) {
        logger.error("Error occurred in checkShareHolderInviteJoined service: ", error);
        response.error = error;
        return response;
    }
}

export const checkDirectorInviteJoined = async (companyId: number) => {
    const response: { success: boolean, error: any, data: any } = { success: false, error: null, data: [] };
    try {
        const pendingDirectorInvites = await listPendingDirectorInvites(companyId);
        if (pendingDirectorInvites.length > 0) {
            response.success = true;
            response.data = pendingDirectorInvites;
            return response;
        }
        return response;
    } catch (error) {
        logger.error("Error occurred in checkDirectorInviteJoined service: ", error);
        response.error = error;
        return response;
    }
}


const buildShareCertificate = async (companyId: number) => {
    const data: any = await getCompanyDetailedInfo(companyId);
    const uploadPromises = data.shareHolders.map(async (shareHolder: any) => {
        try {
            const shareHolderId = shareHolder.id;
            const allCertificates = await fillShareCertificate(data, shareHolderId, companyId);

            if (!allCertificates) {
                throw new Error("allCertificates is undefined");
            }

            const docLinks = await Promise.all(allCertificates.map(async (certificate: any) => {
                const res = await getShareDetailsByShareHolderId(certificate.holderId);
                if (!res || !res.sharesDetails) {
                    throw new Error("shareDetail is null");
                }

                const shareDetail = Array.isArray(res.sharesDetails) ? res.sharesDetails.map((share: any) => ({
                    classOfShares: share.classOfShares,
                    noOfShares: share.noOfShares,
                    shareCertificateUrl: certificate.response.find((cert: any) => cert.class === share.classOfShares)?.docLink || '',
                })) : [];
                if (shareDetail.length === 0) {
                    throw new Error("shareDetail is empty");
                }
                await updateShareCertificate(certificate.holderId, shareDetail);
                return certificate.response;
            }));
            return docLinks;
        } catch (error) {
            logger.error(`Error generating share certificate for shareholder ${shareHolder.id}: `, error);
            return null;
        }
    });
    const uploadLocations = await Promise.all(uploadPromises);
    return uploadLocations.filter(location => location !== null);
}


type NotificationProps = {
    title: string;
    description: string;
    date: string;
  }[];


export const getCompanyDocSignNotification = async (companyId: number) => {
    const response: { success: boolean, error: any, data: any } = { success: false, error: null, data: [] };
    try {
        const getFullInfoOnCompany = await getCompanyDetailedInfo(companyId);
        if (!getFullInfoOnCompany) {
            response.error = "Company Not found";
            return response;
        }

        const notSignedNNC1 = {
            shareholder: 0,
            director: 0,
            secretary: 0
        }

        const companyName = getFullInfoOnCompany.nameEnglish;
        const ShareHolderEmailList = getFullInfoOnCompany.shareHolders.map((shareHolder: any) => ({
            name: shareHolder.name,
            email: shareHolder.email,
            surname: shareHolder.surname ?? '',
            id: shareHolder.id,
            companyId: shareHolder.companyId,
            companyName,
            signed: shareHolder.NNC1Url ? true : false,
            ordinaryShareAggrement: shareHolder.ordinaryShareAgreementUrl ? true : false,
            type: "Shareholder"
        }));

        const count = ShareHolderEmailList.filter((user: any) => !user.signed).length;
        notSignedNNC1.shareholder = count;
        const notSignedShareHoldersShareAggrement = ShareHolderEmailList.filter(user => !user.ordinaryShareAggrement).length;

        const DirectorEmailList = getFullInfoOnCompany.directors.map((director: any) => ({
            name: director.name,
            email: director.email,
            surname: director.surname ?? '',
            id: director.id,
            companyId: director.companyId,
            companyName,
            signed: director.NNC1Url ? true : false,
            minutes: director.minutesUrl ? true : false,
            type: "Director"
        }));

        const countDirector = DirectorEmailList.filter((user: any) => !user.signed).length;
        notSignedNNC1.director = countDirector;
        const notSignedDirectorsMinutes = DirectorEmailList.filter((user: any) => !user.minutes).length;


        const SecretaryEmail = getFullInfoOnCompany.companySecretary ? {
            name: getFullInfoOnCompany.companySecretary.name,
            email: getFullInfoOnCompany.companySecretary.email,
            companyId: getFullInfoOnCompany.companySecretary.companyId,
            companyName,
            signed: getFullInfoOnCompany.companySecretary.NNC1Url ? true : false,
            type: "Secretary"
        } : null;

        const countSecretary = SecretaryEmail && !SecretaryEmail.signed ? 1 : 0;
        notSignedNNC1.secretary = countSecretary;

        // const notSignedUsers = [
        //     ...ShareHolderEmailList.filter(user => !user.signed),
        //     ...DirectorEmailList.filter(user => !user.signed),
        //     ...(SecretaryEmail && !SecretaryEmail.signed ? [SecretaryEmail] : [])
        // ];

        const NNC1StatusMessages = [
            notSignedNNC1.shareholder ? `${companyName}: Not signed by ${notSignedNNC1.shareholder} shareholder(s)` : null,
            notSignedNNC1.director ? `${companyName}: Not signed by ${notSignedNNC1.director} director(s)` : null,
            notSignedNNC1.secretary ? `${companyName}: Not signed by ${notSignedNNC1.secretary} secretary(s)` : null
        ].filter(message => message !== null);

        const ShareAggrementStatusMessage = notSignedShareHoldersShareAggrement
            ? `${companyName}: Not signed by ${notSignedShareHoldersShareAggrement} shareholder(s)`
            : null;

        const MinutesStatusMessage = notSignedDirectorsMinutes
            ? `${companyName}: Not signed by ${notSignedDirectorsMinutes} director(s)`
            : null;

        const notificationArray: NotificationProps = []
        NNC1StatusMessages.forEach(message => {
            notificationArray.push({
            title: "NNC1 Form",
            description: message,
            date: new Date().toLocaleDateString()
            });
        });
        if (ShareAggrementStatusMessage) notificationArray.push({
            title: "Ordinary Share Agreement",
            description: ShareAggrementStatusMessage,
            date: new Date().toLocaleDateString()
        })
        if (MinutesStatusMessage) notificationArray.push({
            title: "Minutes of Meeting",
            description: MinutesStatusMessage,
            date: new Date().toLocaleDateString()
        })

        response.success = true;
        response.data = notificationArray;
        return response;
    } catch (error) {
        logger.error("Error occurred in getUserNotSignedNNC1 service: ", error);
        response.error = error;
        return response;
    }
};