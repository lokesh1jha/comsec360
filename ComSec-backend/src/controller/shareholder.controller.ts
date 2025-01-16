import { Request, Response } from 'express';
import { getShareholderDocumentsService } from '../services/shareholder.service';
import logger from '../utils/logger';
import { signShareholderDocumentsService } from '../services/shareholder.service';
import uploadPdfToS3 from '../utils/uploadToS3/upload';
import { updateDocumentDb, updateToShareHolderTable } from '../db/upload-documents/director';

export const getShareholderDocuments = async (req: Request, res: Response) => {
    try {
        const userId: number = req.body.loggedInUser.id;
        const companyId:number = parseInt(req.params.company_id);
        const documents = await getShareholderDocumentsService(userId, companyId);
        if(!documents.success) {
            logger.error("Error occurred in getShareholderDocuments controller: ", documents);
            res.status(500).json({ success: false, error: documents.error });
            return;
        }

        logger.info("getShareholderDocuments controller: ", documents);
        res.status(200).json({ data: documents });
    } catch (error) {
        logger.error("Error occurred in getShareholderDocuments controller: ", error);
        res.status(500).json({success: false, error: error });
    }
}

export const signShareholderDocuments = async (req: Request, res: Response) => {
    try {
        const userId: number = req.body.loggedInUser.id;
        const companyId: number = req.body.company_id;
        const signature: string = req.body.signature;

        const result = await signShareholderDocumentsService(userId, companyId, signature);
        if (!result.success) {
            logger.error("Error occurred in signShareholderDocuments controller: ", result);
            res.status(500).json({ sucees: false, error: result });
            return;
        }

        const pdfBuffer = result.data;
        const key = result.key;
        const fileName = result.fileName;
        if(!pdfBuffer || !key || !fileName) {
            logger.error("Error occurred in signShareholderDocuments controller: ", result);
            res.status(500).json({ success: false,error: "Error signing document" });
            return;
        }

        
        const uploadToS3:string = await uploadPdfToS3(pdfBuffer, key, fileName);

        // save to document table
        const saveToDocumentTable = await updateDocumentDb({name: "Ordinary Share Agreement", companyId, url: uploadToS3});
        // save to shareHolder table
        const saveToShareHolderTable = await updateToShareHolderTable({id: userId, companyId, url: uploadToS3});

        if(!saveToDocumentTable || !saveToShareHolderTable) {
            logger.error("Error occurred in signShareholderDocuments controller: ", result);
            res.status(500).json({ success: false, error: "Error signing document" });
            return;
        }

        res.status(200).json({ success: true, message: "Document signed successfully" });
    } catch (error) {
        logger.error("Error occurred in signShareholderDocuments controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}

