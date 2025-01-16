import { Request, Response } from 'express';
import { getDirectorDocumentsService } from '../services/director.service';
import logger from '../utils/logger';
import { signDirectorDocumentsService } from '../services/director.service';
import uploadPdfToS3 from '../utils/uploadToS3/upload';
import { updateDocumentDb, updateToDirectorTable } from '../db/upload-documents/director';

export const getDirectorDocuments = async (req: Request, res: Response) => {
    try {
        const userId: number = req.body.loggedInUser.id;
        const companyId: number = parseInt(req.params.company_id);
        const documents = await getDirectorDocumentsService(userId, companyId);
        if (!documents.success) {
            logger.error("Error occurred in getDirectorDocuments controller: ", documents);
            res.status(500).json({ error: documents.error });
            return;
        }

        logger.info("getDirectorDocuments controller: ", documents);
        res.status(200).json({ data: documents });
    } catch (error) {
        logger.error("Error occurred in getDirectorDocuments controller: ", error);
        res.status(500).json({ error: error });
    }
}


export const signDirectorDocuments = async (req: Request, res: Response) => {
    try {
        const userId: number = req.body.loggedInUser.id;
        const companyId: number = req.body.company_id;
        const signature: string = req.body.signature;

        const result = await signDirectorDocumentsService(userId, companyId, signature);
        if (!result.success) {
            logger.error("Error occurred in signDirectorDocuments controller: ", result);
            res.status(500).json({ success: false, error: result });
            return;
        }

        const pdfBuffer = result.data;
        const key = result.key;
        const fileName = result.fileName;
        if (!pdfBuffer || !key || !fileName) {
            logger.error("Error occurred in signDirectorDocuments controller: ", result);
            res.status(500).json({ success: false, error: "Error signing document" });
            return;
        }

        const uploadToS3: string = await uploadPdfToS3(pdfBuffer, key + "/signed", fileName);

        // save to document table
        // const saveToDocumentTable = await updateDocumentDb({ name: "Minutes", companyId, url: uploadToS3 });
        // save to director table
        const saveToDirectorTable = await updateToDirectorTable({ id: userId, companyId, url: uploadToS3 });

        if (!saveToDirectorTable) {
            logger.error("Error occurred in signDirectorDocuments controller: ", result);
            res.status(500).json({ success: false, error: "Error signing document" });
            return;
        }

        res.status(200).json({ success: true, message: "Document signed successfully" });
    } catch (error) {
        logger.error("Error occurred in signDirectorDocuments controller: ", error);
        res.status(500).json({ success: false, error: error });
    }
}
