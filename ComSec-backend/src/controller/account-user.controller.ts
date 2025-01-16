import { Request, Response } from "express";
import logger from "../utils/logger";
import { addOrUpdateSecretaryService, addOrUpdateShareCapitalService, addShareHolderToCompanyService, deleteCompanyDirectorService, deleteCompanyShareHolderService, deleteShareCapitalService, getCompanyDetailsService, getDirectorsService, getSecretaryService, getShareCapitalService, getShareHoldersService, insertCompanyDetails, sendInviteToDirectorsService, sendInviteToShareholderService, updateComanyDetails, uploadCompanyLogoService, uploadShareHolderIdProofService, updateShareHolderInCompany, updateDirectorsService, addDirectorsService, getCompanyListService, addGovernmentDocumentsService, changePasswordService } from "../services/account-user.service";
import { getUsersById } from "../db/user";
import { loginCheckUserService } from "../services/user.service";


// ----------------------- Upload company logo ------------
export const uploadCompanyLogo = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const companyId = parseInt(req.params.company_id);
        const response = await uploadCompanyLogoService(file, companyId);
        logger.info("uploadCompanyLogo controller: ", response);
        const statusCode = response.success ? 200 : 400
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occured in uploadCompanyLogo controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}


// ----------------------- Submit company details ------------
export const submitCompanyDetails = async (req: Request, res: Response) => {
    try {
        const { company_id } = req.params
        let response = {success: false, data: null, error: null}
        if (!company_id) {
            response = await insertCompanyDetails(req.body);
        }
        else {
            response = await updateComanyDetails(req.body, parseInt(company_id));
        }
        logger.info("submitCompanyDetails controller: ", response);
        const statusCode = response.success ? 200 : 400
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occured in submitCompanyDetails controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}



// ----------------------- Get company details ------------
export const getCompanyDetails = async (req: Request, res: Response) => {
    try {
        // get company_id from param
        const companyId = parseInt(req.params.company_id)

        const response = await getCompanyDetailsService(companyId);
        logger.info("getCompanyDetails controller: ", response);
        const statusCode = response.success ? 200 : 400
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occured in getCompanyDetails controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

// ========================================SHARE CAPITAL============================================

// ----------------------- Add or update share capital ------------
export const addOrUpdateShareCapitalByAccountUser = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        const userId = req.body.loggedInUser.id
        const shareCapitalId = parseInt(req.params.share_capital_id)

        const addOrUpdateShareCapital = await addOrUpdateShareCapitalService(req.body, companyId, userId, shareCapitalId);
        logger.info("addOrUpdateShareCapitalByAccountUser controller: ", addOrUpdateShareCapital);
        const statusCode = addOrUpdateShareCapital.success ? 200 : 400
        res.status(statusCode).json(addOrUpdateShareCapital);
    } catch (error) {
        logger.error("Error occured in addOrUpdateShareCapitalByAccountUser controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

// ----------------------- Get share capital ------------
export const getShareCapitals = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        if(!companyId) {
            res.status(400).json({success: false, error: "Company id is required"})
            return
        }
        const getShareCapital = await getShareCapitalService(companyId);
        logger.info("getShareCapitalByAccountUser controller: ", getShareCapital);
        const statusCode = getShareCapital.success ? 200 : 400
        res.status(statusCode).json(getShareCapital);
    } catch (error) {
        logger.error("Error occured in addOrUpdateShareCapitalByAccountUser controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}


// ----------------------- Delete share capital ------------
export const deleteShareCapital = async (req: Request, res: Response) => {
    try {
        const shareCapitalId = parseInt(req.params.share_capital_id)
        const companyId = parseInt(req.params.company_id)
        const userId = req.body.loggedInUser.id
        const deleteShareCapital = await deleteShareCapitalService(shareCapitalId, companyId, userId);
        logger.info("deleteShareCapital controller: ", deleteShareCapital);
        const statusCode = deleteShareCapital.success ? 200 : 400
        res.status(statusCode).json(deleteShareCapital);
    } catch (error) {
        logger.error("Error occured in deleteShareCapital controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

//=========================SHARE HOLDERS===============================

// ----------------------- Add or update share holder ------------
// ----------------------- Add share holder ------------
export const addShareHolderByAccountUser = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id);
        const response = await addShareHolderToCompanyService(req.body, companyId, req.body.loggedInUser.id);
        logger.info("addShareHolderByAccountUser controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in addShareHolderByAccountUser controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}

// ----------------------- Update share holder ------------
export const updateShareHolderByAccountUser = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id);
        console.log("req.body: ", req.body, companyId);
        const response = await updateShareHolderInCompany(req.body, companyId, req.body.loggedInUser.id);
        logger.info("updateShareHolderByAccountUser controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in updateShareHolderByAccountUser controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}


// ----------------------- Uplaod share capital id proof ------------
export const uploadShareHolderIdProof = async (req: Request, res: Response) => {
    try {
        const comapnyId = parseInt(req.params.company_id)
        const file = req.file
        if(!comapnyId) {
            res.status(400).json({success: false, error: "Company id is required"})
            return
        }
        const reposne = await uploadShareHolderIdProofService(file, comapnyId, req.body.loggedInUser.id)
        logger.info("uploadShareHolderIdProof controller: ", reposne);
        const statusCode = reposne.success ? 200 : 400
        res.status(statusCode).json(reposne);
    } catch (error) {
        logger.error("Error occured in uploadShareHolderIdProof controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}


// ----------------------- Get share holders ------------
export const getShareHolders = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        if(!companyId) {
            res.status(400).json({success: false, error: "Company id is required"})
            return
        }
        const getShareHolders = await getShareHoldersService(companyId);
        logger.info("getShareHoldersByAccountUser controller: ", getShareHolders);
        const statusCode = getShareHolders.success ? 200 : 400
        res.status(statusCode).json(getShareHolders);
    } catch (error) {
        logger.error("Error occured in getShareHoldersByAccountUser controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

// ----------------------- Delete company's share holder ------------
export const deleteCompanyShareHolder = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id);
        const shareHolderId = parseInt(req.params.shareholder_id);
        if (!companyId || !shareHolderId) {
            res.status(400).json({ success: false, error: "Company id and share holder id are required" });
            return;
        }
        const response = await deleteCompanyShareHolderService(companyId, shareHolderId);
        console.log("deleteCompanyShareHolder controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in deleteCompanyShareHolder controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}

// ----------------------- Send Invite to share holder ------------
export const sendInviteToShareholder = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        const { name, email, shareDetails } = req.body
        if(!companyId || !name || !email || !shareDetails) {
            res.status(400).json({success: false, error: "Company id, name and email is required"})
            return
        }
        const response = await sendInviteToShareholderService(companyId, name, email, shareDetails, req.body.loggedInUser.id);
        // logger.info("sendInviteToShareholder controller: ", response);
        console.log("sendInviteToShareholder controller: ", response);
        const statusCode = response.success ? 200 : 400
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occured in sendInviteToShareholder controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}


// ======================== Directors ===========================

// ----------------------- Add director ------------
export const addDirectorByAccountUser = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id);
        const response = await addDirectorsService(req.body, companyId, req.body.loggedInUser.id);
        logger.info("addDirectorByAccountUser controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in addDirectorByAccountUser controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}

// ----------------------- Update director ------------
export const updateDirectorByAccountUser = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id);
        const response = await updateDirectorsService(req.body, companyId, req.body.loggedInUser.id);
        logger.info("updateDirectorByAccountUser controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in updateDirectorByAccountUser controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}

// ----------------------- Get directors ------------
export const getDirectors = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        if(!companyId) {
            res.status(400).json({success: false, error: "Company id is required"})
            return
        }
        const getDirectors = await getDirectorsService(companyId);
        logger.info("getDirectorsByAccountUser controller: ", getDirectors);
        const statusCode = getDirectors.success ? 200 : 400
        res.status(statusCode).json(getDirectors);
    } catch (error) {
        logger.error("Error occured in getDirectorsByAccountUser controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

// ----------------------- Send Invite to directors ------------
export const sendInviteToDirectors = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        const { name, email } = req.body
        if(!companyId || !name || !email ) {
            res.status(400).json({success: false, error: "Company id, name and email is required"})
            return
        }
        const response = await sendInviteToDirectorsService(companyId, name, email, req.body.loggedInUser.id);
        // logger.info("sendInviteToDirectors controller: ", response);
        console.log("sendInviteToDirectors controller: ", response);
        const statusCode = response.success ? 200 : 400
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occured in sendInviteToDirectors controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

//---------------------- Delete Compan's Director ------------
export const deleteCompanyDirector = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        const directorId = parseInt(req.params.director_id)
        if(!companyId || !directorId) {
            res.status(400).json({success: false, error: "Company id and director id is required"})
            return
        }
        const response = await deleteCompanyDirectorService(companyId, directorId);
        // logger.info("deleteCompanyDirector controller: ", response);
        console.log("deleteCompanyDirector controller: ", response);
        const statusCode = response.success ? 200 : 400
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occured in deleteCompanyDirector controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}


// =========================== Company Secretary ==========================

export const addOrUpdateSecretaryByAccountUser = async (req: Request, res: Response) => {
    try {
        const comapnyId = parseInt(req.params.company_id)
        const reposne = await addOrUpdateSecretaryService(req.body, comapnyId, req.body.loggedInUser.id)
        logger.info("addOrUpdateSecretaryByAccountUser controller: ", reposne);
        const statusCode = reposne.success ? 200 : 400
        res.status(statusCode).json(reposne);
    } catch (error) {
        logger.error("Error occured in addOrUpdateSecretaryByAccountUser controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}

export const getSecretary = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id)
        if(!companyId) {
            res.status(400).json({success: false, error: "Company id is required"})
            return
        }
        const getSecretary = await getSecretaryService(companyId);
        logger.info("getSecretaryByAccountUser controller: ", getSecretary);
        const statusCode = getSecretary.success ? 200 : 400
        res.status(statusCode).json(getSecretary);
    } catch (error) {
        logger.error("Error occured in getSecretaryByAccountUser controller: ", error);
        res.status(500).json({ sucess: false, error: error });
    }
}


export const getCompanyCount = async (req: Request, res: Response) => {
    try {
        const userId = req.body.loggedInUser.id;
        const response = await getCompanyListService(userId);
        logger.info("getCompanyCount controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in getCompanyCount controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}
// ----------------------- Add government documents ------------
export const addGovernmentDocuments = async (req: Request, res: Response) => {
    try {
        const companyId = parseInt(req.params.company_id);
        const files = req.files;
        const { incorporate } = req.body;

        if (!companyId || !files || !incorporate) {
            res.status(400).json({ success: false, error: "Company id and files are required" });
            return;
        }
        
        const response = await addGovernmentDocumentsService(files, companyId, incorporate);
        logger.info("addGovernmentDocuments controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in addGovernmentDocuments controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}

// ----------------------- Change password ------------
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.body.loggedInUser.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            res.status(400).json({ success: false, error: "Old password and new password are required" });
            return;
        }
        const result = await loginCheckUserService(req.body.loggedInUser.email, oldPassword);
        if(result.error || !result.success || !result.data) {
            res.status(400).json({ success: false, error: "Invalid old password" });
            return;
        }

        const response = await changePasswordService(userId, newPassword);
        logger.info("changePassword controller: ", response);
        const statusCode = response.success ? 200 : 400;
        res.status(statusCode).json(response);
    } catch (error) {
        logger.error("Error occurred in changePassword controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}