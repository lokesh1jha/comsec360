import { deleteShareCapitalFromDb, getCompanyDetailsFromDb, getCompanyCountFromDb, getShareCapitalFromDb, insertCompanyDetailsInDb, insertCompanyShareCapitalInDb, updateCompanyDetails, updateCompanyLogoInDb, updateShareCapitalInDb } from "../db/account-users/company-details-query";
import { addShareHolderToCompany, deleteCompanyShareHolderFromDb, getShareHoldersFromDb, saveShareholderInviteInDb, updateShareHolderInDB } from "../db/account-users/share-holders-query";
import { addDirectorInDB, deleteCompanyDirectorFromDb, getDirectorsFromDb, saveDirectorsInviteInDb, updateDirectorInDB } from "../db/account-users/director-query";
import { sendEmail } from "../utils/email/sendEmail";
import { guestInviteEmailTemplate } from "../utils/email/sendInvite";
import { generateDirectorInviteLink, generateShareHolderInviteLink } from "../utils/inviteLink";
import bcrypt from "bcrypt";
import logger from "../utils/logger";
import { generatePresignedUrl, uploadFileToS3 } from "../utils/s3Upload";
import { addOrUpdateSecretary, changePasswordInDb, getSecretaryFromDb, saveGovermentDocumentsInDb } from "../db/account-users/company-secretary";
import { updateCompanyStatusDB } from "../db/company";

const ADMIN_EMAIL = process.env.SENDER_EMAIL || "lokesh9jha@gmail.com";


type StandardResponseInerface = {
    success: boolean;
    data: any;
    shareTypeMap?: any;
    error: any;
}

export const insertCompanyDetails = async (company: any): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await insertCompanyDetailsInDb(company);
        console.log("result./....", result);
        if (!result) {
            response.error = "Error creating account user";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in insertCompanyDetails service: ", error);

        response.error = error;
        return response;
    }
};

export const updateComanyDetails = async (company: any, companyId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await updateCompanyDetails(company, companyId);
        if (!result) {
            response.error = "Error updating company details";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error) {
        logger.error("Error occured in updateCompanyDetails service: ", error);
        response.error = error;
        return response;
    }
}


export const uploadCompanyLogoService = async (file: any, companyId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const uploadResponse = await uploadFileToS3(file, companyId, "company_logo");
        if (!uploadResponse.success) {
            response.error = uploadResponse.error;
            return response;
        }
        let islogoUpdated = false;
        if (companyId) {
            islogoUpdated = await updateCompanyLogoInDb(uploadResponse.data.location, companyId);
            // logger.log("islogoUpdated: ", {islogoUpdated, location: uploadResponse.data.location, companyId});
        } else {
            islogoUpdated = true // no company id
        }
        response.success = uploadResponse.success && islogoUpdated;
        response.data = uploadResponse.data;
        return response;
    } catch (error) {
        logger.error("Error occured in uploadCompanyLogo service: ", error);
        response.error = error;
        return response;
    }

}


export const getCompanyDetailsService = async (companyId: number): Promise<any> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const company = await getCompanyDetailsFromDb(companyId);

        if (!company) {
            throw new Error(`Company with ID ${companyId} not found.`);
        }
        const signedCompanyLogo = await generatePresignedUrl(company.logo);
        // Format the data for the frontend
        const formattedData = {
            id: company.id,
            name: company.nameEnglish,
            chiname: company.nameChinese,
            type: company.type.toUpperCase(),
            code: company.code,
            nature: company.natureOfBusiness,
            house: company.address?.flatFloor || '',
            building: company.address?.building || '',
            street: company.address?.street || '',
            district: company.address?.district || '',
            country: company.address?.city || '',
            email: company.email,
            companyTel: company.telephone,
            companyfax: company.fax,
            time: company.businessFee === 'ONE_YEAR' ? '1 year' : '3 years',
            presentorName: company.presentorReference?.nameEnglish || '',
            presentorChiName: company.presentorReference?.nameChinese || '',
            presentorAddress: company.presentorReference?.address || '',
            presentorTel: company.presentorReference?.telephone || '',
            presentorFax: company.presentorReference?.fax || '',
            presentorEmail: company.presentorReference?.email || '',
            presentorReferance: company.presentorReference?.presentorsReferance || '',
            companyLogo: signedCompanyLogo,
        };

        response.success = true;
        response.data = formattedData;
        return response;
    } catch (error) {
        console.error('Error fetching company details:', error);
        response.error = error;
        return response;
    }
};


export const getCompanyListService = async (userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const companies = await getCompanyCountFromDb(userId);
        if (companies == null || companies == undefined) {
            response.error = "Error fetching company list";
            return response;
        }
        response.success = true;
        response.data = companies;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in getCompanyListService: ", error);
        response.error = error;
        return response;
    }
}

// ================= Share Capital =======================
export const addOrUpdateShareCapitalService = async (shareCapital: any, comapnyId: number, userId: string, shareCapitalId: number | null | undefined): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        let result: any;
        if (shareCapitalId) {
            result = await updateShareCapitalInDb(shareCapital, shareCapitalId, userId);
        }
        else {
            result = await insertCompanyShareCapitalInDb(shareCapital, comapnyId, userId);

        }
        if (!result) {
            logger.error("Error creating account user");
            response.error = "Error creating account user";
            return response;
        }
        response.success = true;
        response.data = result
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in addOrUpdateShareCapital service: ", error);

        response.error = error;
        return response;
    }
}

export const getShareCapitalService = async (comapnyId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, shareTypeMap: null, error: null };
    try {
        const result = await getShareCapitalFromDb(comapnyId);
        if (!result) {
            logger.error("Error getting share capital");
            response.error = "Error getting share capital";
            return response;
        }
        const shareHolders = await getShareHoldersFromDb(comapnyId);
        const shareTypeMap: { [key: string]: number } = {};

        if (shareHolders) {

            for (const shareHolder of shareHolders) {
                if (Array.isArray(shareHolder.sharesDetails)) {
                    for (const shareDetail of shareHolder.sharesDetails) {
                        console.log("shareDetail: ", typeof shareDetail === 'object');
                        if (shareDetail && typeof shareDetail === 'object' && 'classOfShares' in shareDetail && 'noOfShares' in shareDetail && typeof shareDetail.classOfShares === 'string' && typeof shareDetail.noOfShares === 'number') {
                            if (shareTypeMap[shareDetail.classOfShares]) {
                                shareTypeMap[shareDetail.classOfShares] += shareDetail.noOfShares;
                            } else {
                                shareTypeMap[shareDetail.classOfShares] = shareDetail.noOfShares;
                            }
                        }
                    }
                }
            }
            for (const share of result) {
                if (shareTypeMap[share.class]) {
                    shareTypeMap[share.class] = share.totalProposed - shareTypeMap[share.class];
                } else {
                    shareTypeMap[share.class] = share.totalProposed;
                }
            }
        }

        response.success = true;
        response.data = result;
        response.shareTypeMap = shareTypeMap;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in getShareCapital service: ", error);

        response.error = error;
        return response;
    }
}

export const deleteShareCapitalService = async (shareCapitalId: number, comapnyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await deleteShareCapitalFromDb(shareCapitalId, comapnyId, userId);
        console.log("result:----------------- ", result);
        if (!result) {
            logger.error("Error deleting share capital");
            response.error = "Error deleting share capital";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in deleteShareCapital service: ", error);

        response.error = error;
        return response;
    }
}

export const addShareHolderToCompanyService = async (shareHolder: any, comapnyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await addShareHolderToCompany(shareHolder, comapnyId, userId);
        if (!result.success) {
            response.success = false;
            logger.error("Error adding share holder to company");
            response.error = "Error adding share holder to company";
            return response;
        }
        response.success = true;
        response.data = result.data;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in addShareHolderToCompany service: ", error);

        response.error = error;
        return response;
    }
}

export const updateShareHolderInCompany = async (shareHolder: any, comapnyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        delete shareHolder.loggedInUser;
        console.log("shareHolder: ", shareHolder.name);
        const result = await updateShareHolderInDB(shareHolder, comapnyId, userId);
        if (!result.success) {
            logger.error("Error updating share holder to company");
            response.error = "Error updating share holder to company";
            return response;
        }
        response.success = true;
        response.data = result.data;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in updateShareHolderInCompany: ", error);
        response.error = error;
        return response;
    }
}


export const uploadShareHolderIdProofService = async (file: any, comapnyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await uploadFileToS3(file, comapnyId, "id_proof");
        if (!result.success) {
            logger.error("Error uploading idProof of share holder to company");
            response.error = "Error uploading idProof of share holder to company";
            return response;
        }
        response.success = true;
        response.data = result.data;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in addShareHolderToCompany service: ", error);

        response.error = error;
        return response;
    }
}

export const getShareHoldersService = async (comapnyId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await getShareHoldersFromDb(comapnyId);
        if (!result) {
            logger.error("Error getting share capital");
            response.error = "Error getting share capital";
            return response;
        }

        // result=> sharesDetails loop and getsignedutl for each share certificate
        for (const shareHolder of result) {
            if (Array.isArray(shareHolder.sharesDetails)) {
                for (const sharesDetail of shareHolder.sharesDetails) {
                    if (sharesDetail && typeof sharesDetail === 'object' && 'shareCertificateUrl' in sharesDetail) {
                        if (sharesDetail.shareCertificateUrl) {
                            sharesDetail.shareCertificateUrl = await generatePresignedUrl(sharesDetail.shareCertificateUrl as string);
                        }
                    }
                }
            }
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in getShareHolders service: ", error);

        response.error = error;
        return response;
    }
}


export const deleteCompanyShareHolderService = async (companyId: number, shareHolderId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await deleteCompanyShareHolderFromDb(companyId, shareHolderId);
        if (!result) {
            logger.error("Error deleting company shareholder");
            response.error = "Error deleting company shareholder";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in deleteCompanyShareHolderService: ", error);

        response.error = error;
        return response;
    }
}

export const sendInviteToShareholderService = async (comapnyId: number, name: string, email: string, shareDetails: any, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const inviteData = {
            name: name,
            email: email,
            sharesDetails: shareDetails,
            otp: otp,
            linkExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            isAccepted: false,
            invitedByUserId: userId,
            shareholderId: null,
            companyId: comapnyId
        }
        const saveInDb = await saveShareholderInviteInDb(inviteData);
        console.log("saveInDb: ", saveInDb);
        if (!saveInDb) {
            logger.error("Error while saving shareholder invite in db");
            response.error = "Error while saving shareholder invite in db";
            return response;
        }

        const link = generateShareHolderInviteLink(comapnyId, saveInDb.id, email, "shareholder");
        const emailBody = guestInviteEmailTemplate("Share Holder", link, otp);

        const result = await sendEmail(emailBody, "Share Holder Invite", email, ADMIN_EMAIL, "Welcome to ComSec360");
        if (!result) {
            logger.error("Error in sending invite mail");
            response.error = "Error in sending invite mail";
            return response;
        }

        response.success = true;
        response.data = saveInDb;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in sendInviteToShareholderService service: ", error);

        response.error = error;
        return response;
    }
}

export const addDirectorsService = async (directors: any, companyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await addDirectorInDB(directors, companyId);
        console.log("result:----------------- ", result);
        if (!result.success) {
            logger.error("Error adding directors");
            response.error = "Error adding directors";
            return response;
        }
        response.success = true;
        response.data = result.data;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in addDirectorsService: ", error);
        response.error = error;
        return response;
    }
}

export const updateDirectorsService = async (directors: any, companyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await updateDirectorInDB(directors, companyId);
        console.log("result:----------------- ", result);
        if (!result.success) {
            logger.error("Error updating directors");
            response.error = "Error updating directors";
            return response;
        }
        response.success = true;
        response.data = result.data;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in updateDirectorsService: ", error);
        response.error = error;
        return response;
    }
}

export const getDirectorsService = async (comapnyId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await getDirectorsFromDb(comapnyId);
        if (!result) {
            logger.error("Error getting directors");
            response.error = "Error getting directors";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in getDirectors service: ", error);

        response.error = error;
        return response;
    }
}


export const sendInviteToDirectorsService = async (comapnyId: number, name: string, email: string, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        const inviteData = {
            name: name,
            email: email,
            otp: otp,
            linkExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            isAccepted: false,
            invitedByUserId: userId,
            directorId: null,
            companyId: comapnyId
        }
        const saveInDb = await saveDirectorsInviteInDb(inviteData);
        console.log("saveInDb: ", saveInDb);
        if (!saveInDb) {
            logger.error("Error while saving directors invite in db");
            response.error = "Error while saving directors invite in db";
            return response;
        }

        const link = generateDirectorInviteLink(comapnyId, saveInDb.id, email, "director");
        const emailBody = guestInviteEmailTemplate("Directors", link, otp);

        const result = await sendEmail(emailBody, "Director Invite", email, ADMIN_EMAIL, "Welcome to ComSec360");
        if (!result) {
            logger.error("Error in sending invite mail");
            response.error = "Error in sending invite mail";
            return response;
        }

        response.success = true;
        response.data = saveInDb;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in sendInviteToDirectorsService service: ", error);

        response.error = error;
        return response;
    }
}

export const deleteCompanyDirectorService = async (companyId: number, directorId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await deleteCompanyDirectorFromDb(companyId, directorId);
        if (!result) {
            logger.error("Error deleting company director");
            response.error = "Error deleting company director";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in deleteCompanyDirector service: ", error);

        response.error = error;
        return response;
    }
}

// ================= Company Secretary =======================

export const addOrUpdateSecretaryService = async (secretary: any, comapnyId: number, userId: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await addOrUpdateSecretary(secretary, comapnyId, userId);
        console.log("result:----------------- ", result);
        if (!result) {
            logger.error("Error adding or updating secretary");
            response.error = "Error adding or updating secretary";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in addOrUpdateSecretary service: ", error);

        response.error = error;
        return response;
    }
}

export const getSecretaryService = async (comapnyId: number): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const result = await getSecretaryFromDb(comapnyId);
        if (!result) {
            logger.error("Error getting secretary");
            response.error = "Error getting secretary";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occured in getSecretary service: ", error);

        response.error = error;
        return response;
    }
}


export const addGovernmentDocumentsService = async (files: any, companyId: number, incorporate: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const { certificateOfIncorporate, notice, reciepts } = files;

        const documents = [
            { file: certificateOfIncorporate, type: "certificateOfIncorporation" },
            { file: notice, type: "registrationNotice" },
            { file: reciepts, type: "receipt" }
        ];

        const uploadResponses = await Promise.all(documents.map(doc => uploadFileToS3(doc.file[0], companyId, `goverment_documents_${doc.type}`)));

        const documentUrls = uploadResponses.reduce((acc: { [key: string]: string }, uploadResponse: any, index: number) => {
            if (uploadResponse.success) {
                acc[documents[index].type] = uploadResponse.data.location;
            }
            return acc;
        }, {});

        const bodyToSaveInDb = {
            "certificateOfIncorporationUrl": documentUrls.certificateOfIncorporation,
            "registrationNoticeUrl": documentUrls.registrationNotice,
            "receiptUrl": documentUrls.receipt,
            "incorporationDate": new Date(incorporate)
        }

        // Assuming you have a function to save these document URLs in the database
        const saveResult = await saveGovermentDocumentsInDb(bodyToSaveInDb, companyId);

        if (!saveResult) {
            response.error = "Error saving government documents in database";
            return response;
        }

        await updateCompanyStatusDB(companyId, 'completed');
        response.success = true;
        response.data = [];
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in addGovernmentDocumentsService: ", error);
        response.error = error;
        return response;
    }
}


export const changePasswordService = async (userId: string, newPassword: string): Promise<StandardResponseInerface> => {
    let response: StandardResponseInerface = { success: false, data: null, error: null };
    try {
        const saltRounds = 12;
        const rawPassword = newPassword;
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

        const result = await changePasswordInDb(userId, hashedPassword);
        if (!result) {
            response.error = "Error changing password";
            return response;
        }
        response.success = true;
        response.data = result;
        return response;
    } catch (error: Error | any) {
        logger.error("Error occurred in changePasswordService: ", error);
        response.error = error;
        return response;
    }
}