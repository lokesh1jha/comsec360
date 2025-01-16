import { Request, Response } from 'express';
import logger from '../utils/logger';
import { checkCompanyStatus, checkDirectorInviteJoined, checkShareHolderInviteJoined, generateAllDocData, getCompanyDocSignNotification, sendNNC1Email } from '../services/company.service';
import { getDocumentsByCompanyId, updateCompanyStatusDB } from '../db/company';
import { generatePresignedUrl, uploadFileToS3 } from '../utils/s3Upload';
import { getCompanySecretaryById, getDirectorById, getShareHoldersById } from '../db/account-users/share-holders-query';
import { getCompanyIdByUserId, saveNNC1FormLinkToCompanySecretary, saveNNC1FormLinkToDirector, saveNNC1FormLinkToShareHolder } from '../db/multi-user';



export const produceAndEmailAllDoc = async (req: Request, res: Response) => {
    try {
        const companyId: number = parseInt(req.params.company_id);
        const allDocData = await generateAllDocData(companyId);
        if (!allDocData.success || !allDocData.data) {
            res.status(400).json({
                message: 'Error generating All company documents',
            });
            return
        }

        const emailResult = await sendNNC1Email(allDocData.data, allDocData.fullInfoOnCompany);
        const updateCompanyStatusResponse = await updateCompanyStatusDB(companyId, 'in_progress');
        if (!emailResult.success) {
            res.status(400).json({
                message: 'Error sending email to the company',
                error: emailResult.error,
            });
            return
        }

        res.status(200).json({
            message: 'All Company Doc produced and emailed successfully',
            emailResult,
        });
    } catch (error) {
        logger.error("Error occured on produceAndEmailAllDoc", error)
        res.status(500).json({
            message: 'Error producing and emailing the Company Doc',
            error: error,
        });
    }
};

export const checkCompanyDetails = async (req: Request, res: Response) => {
    try {
        const companyId: number = parseInt(req.params.company_id);

        // check the company status if in-progress or completed then yes
        const companyStaus = await checkCompanyStatus(companyId);
        if (companyStaus && (companyStaus === 'completed' || companyStaus === 'in_progress')) {
            res.status(200).json({
                message: `Company details are complete. Company status is ${companyStaus}`,
                data: companyStaus,
                isCompleted: true,
            });
            return;
        }

        // Verify if the invited shareholders and directors have joined in parallel
        const [isShareHolderInviteJoined, isDirectorInviteJoined] = await Promise.all([
            checkShareHolderInviteJoined(companyId),
            checkDirectorInviteJoined(companyId)
        ]);

        if (isShareHolderInviteJoined.error || isDirectorInviteJoined.error) {
            res.status(400).json({
                message: 'Error checking shareholder or director invitation acceptance',
                error: isShareHolderInviteJoined.error || isDirectorInviteJoined.error,
                isCompleted: false,
            });
            return;
        }

        if (isShareHolderInviteJoined.data.length > 0 || isDirectorInviteJoined.data.length > 0) {
            res.status(400).json({
                message: 'Pending shareholder or director invitation acceptance',
                error: isShareHolderInviteJoined.error || isDirectorInviteJoined.error,
                isCompleted: false,
            });
            return;
        }

        if (isShareHolderInviteJoined.data.length == 0 && isDirectorInviteJoined.data.length == 0) {
            // update the company status to in-progress
            const updateCompanyStatusResponse = await updateCompanyStatusDB(companyId, 'in_progress');
            if (!updateCompanyStatusResponse.success) {
                res.status(400).json({
                    message: 'Error updating company status to in-progress',
                    error: updateCompanyStatusResponse.error,
                    isCompleted: false,
                });
                return;
            } else {
                res.status(200).json({
                    message: 'Company details are completed.',
                    success: true,
                    isCompleted: true,
                });
                return;
            }
        }
        res.status(200).json({
            message: 'Company details are not complete, please wait till all the shareholders and directors have joined',
            success: false,
            isCompleted: false,
        });
    } catch (error) {
        logger.error("Error occurred on checkCompanyDetails", error);
        res.status(500).json({
            message: 'Error retrieving company details',
            error: error,
            isCompleted: false,
        });
    }
};


export const getCompanyDocuments = async (req: Request, res: Response) => {
    try {
        const companyId: number = parseInt(req.params.company_id);
        const documents = await getDocumentsByCompanyId(companyId);

        if (!documents) {
            res.status(400).json({
                message: 'Error retrieving company documents',
                error: 'No documents found',
            });
            return;
        }

        const noSignedRequired = ['IRBRI', 'Article of Association (A & A)']
        const formattedDocuments = await Promise.all(documents.map(async (doc: any) => {
            const signedUrl = await generatePresignedUrl(doc.url) ?? '';
            console.log("signedUrl", doc.name, signedUrl);
            return {
                id: doc.id,
                name: doc.name,
                previewLink: signedUrl,
                status: noSignedRequired.includes(doc.name) ? "unsigned" : "signed",
                signed_count: "1",
                printLink: signedUrl,

            };
        }));
        res.status(200).json({
            message: 'Company documents retrieved successfully',
            data: formattedDocuments,
        });
    } catch (error) {
        logger.error("Error occurred on getCompanyDocuments", error);
        res.status(500).json({
            message: 'Error retrieving company documents',
            error: error,
        });
    }
};


export const uploadNNC1Form = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const position: string = (req.params.position).toLowerCase().split(' ')[0];
        const file = req.file;
        if (!file) {
            res.status(400).json({
                message: 'No file uploaded',
            });
            return;
        }

        let companyId: number;
        let uploadResponse: any;
        let updateResult: any;
        switch (position) {
            case 'shareholder':
                const respone = await getShareHoldersById(id);
                if (!respone || !respone.companyId) {
                    res.status(400).json({
                        message: 'No shareholder found',
                    });
                    return;
                }
                companyId = respone.companyId;
                uploadResponse = await uploadFileToS3(file, id, `company_documents/${companyId}/NNC1`, `shareholder`);
                if (!uploadResponse.success) {
                    res.status(500).json({
                        message: 'Error uploading file',
                        error: uploadResponse.error,
                    });
                    return;
                }
                updateResult = await saveNNC1FormLinkToShareHolder(id, uploadResponse.data.location);
                break;
            case 'director':
                const director = await getDirectorById(id);
                if (!director || !director.companyId) {
                    res.status(400).json({
                        message: 'No director found',
                    });
                    return;
                }
                companyId = director.companyId;
                uploadResponse = await uploadFileToS3(file, id, `company_documents/${companyId}/NNC1`, `director`);
                if (!uploadResponse.success) {
                    res.status(500).json({
                        message: 'Error uploading file',
                        error: uploadResponse.error,
                    });
                    return;
                }
                updateResult = await saveNNC1FormLinkToDirector(id, uploadResponse.data.location);
                break;
            case 'company': // company secretary
                const companySecretary = await getCompanySecretaryById(id);
                if (!companySecretary || !companySecretary.companyId) {
                    res.status(400).json({
                        message: 'No company secretary found',
                    });
                    return;
                }
                companyId = companySecretary.companyId;
                uploadResponse = await uploadFileToS3(file, id, `company_documents/${companyId}/NNC1`, `company_secretary`);
                if (!uploadResponse.success) {
                    res.status(500).json({
                        message: 'Error uploading file',
                        error: uploadResponse.error,
                    });
                    return;
                }
                updateResult = await saveNNC1FormLinkToCompanySecretary(id, uploadResponse.data.location);
                break;
            default:
                res.status(400).json({
                    message: 'Invalid position specified',
                });
                return;
        }


        if (!updateResult) {
            res.status(500).json({
                message: 'Error updating company status',
                error: updateResult.error,
            });
            return;
        }

        res.status(200).json({
            message: 'NNC1 form uploaded and company status updated successfully',
            data: updateResult.data,
        });
    } catch (error) {
        logger.error("Error occurred on uploadNNC1Form", error);
        res.status(500).json({
            message: 'Error uploading NNC1 form',
            error: error,
        });
    }
};


export const getNotification = async (req: Request, res: Response) => {
    try {
        // const companyId: number = parseInt(req.params.company_id);
        const userId = req.body.loggedInUser.id;
        const getAllCompanyIds = await getCompanyIdByUserId(userId);
        if (getAllCompanyIds.length == 0) {
            res.status(400).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }

        const notifications = [];
        for (const companyId of getAllCompanyIds) {
            const notice = await getCompanyDocSignNotification(companyId);
            notifications.push(...notice.data);
        }

        res.status(200).json({
            success: true,
            message: 'Company documents retrieved successfully',
            data: notifications,
        });

    } catch (error) {
        logger.error("Error occurred on getCompanyDocuments", error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving company documents',
            error: error,
        });
    }
}

export const getCompanyDocumentsCount = async (req: Request, res: Response) => {
    try {
        const companyId: number = parseInt(req.params.company_id);
        const documents = await getDocumentsByCompanyId(companyId);

        
        res.status(200).json({
            message: 'Company documents retrieved successfully',
            data: documents.length,
        });
    } catch (error) {
        logger.error("Error occurred on getCompanyDocuments", error);
        res.status(500).json({
            message: 'Error retrieving company documents',
            error: error,
        });
    }
};