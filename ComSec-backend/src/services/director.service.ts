import { getDirectorById } from "../db/account-users/share-holders-query";
import { getDocumentsByCompanyId } from "../db/company";
import { getdirectorDocumentsDb } from "../db/upload-documents/director"
import { generatePresignedUrl } from "../utils/s3Upload";
import { drawTextField, PDFDocument, StandardFonts } from 'pdf-lib';
import { writeFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

export const getDirectorDocumentsService = async (directorId: number, companyId: number) => {
    let response: { success: boolean, data: any, error: any } = { success: false, data: null, error: null };

    try {
        const { directorDocuments, documents, company } = await getdirectorDocumentsDb(directorId, companyId);

        if (!directorDocuments || !documents) {
            response.error = "No documents found";
            return response;
        }

        directorDocuments.NNC1Url = (directorDocuments.NNC1Url ? await generatePresignedUrl(directorDocuments.NNC1Url) : directorDocuments.NNC1Url) ?? '';
        directorDocuments.idProof = (directorDocuments.idProof ? await generatePresignedUrl(directorDocuments.idProof) : directorDocuments.idProof) ?? '';
        directorDocuments.addressProof = (directorDocuments.addressProof ? await generatePresignedUrl(directorDocuments.addressProof) : directorDocuments.addressProof) ?? '';
        directorDocuments.minutesUrl = (directorDocuments.minutesUrl ? await generatePresignedUrl(directorDocuments.minutesUrl) : directorDocuments.minutesUrl) ?? '';
        
        for (const document of documents) {
            document.url = (document.url ? await generatePresignedUrl(document.url) : document.url) ?? '';
        }

        response.success = true;
        response.data = { directorDocuments, documents, company };
    } catch (error: any) {
        response.error = error.message || "An error occurred";
    }

    return response;
}


export const signDirectorDocumentsService = async (directorId: number, companyId: number, signature: string) => {
    let response: { success: boolean, data: Uint8Array<ArrayBufferLike> | null, error: any, key: string, fileName: string } =
        { success: false, data: null, error: null, key: '', fileName: '' };

    try {
        const documentUrl = await getDocumentsByCompanyId(companyId);
        const director = await getDirectorById(directorId);
        const directorIdNo = director?.idNo;

        console.log("documentUrl: ", documentUrl);

        const DirectorAgreementURL = documentUrl.find((doc: any) => doc.name === "Minutes")?.url;
        if (!DirectorAgreementURL || !directorIdNo) {
            response.error = "No documents found";
            return response;
        }
        const DirectorAgreementSignedURL = await generatePresignedUrl(DirectorAgreementURL);
        if (!DirectorAgreementSignedURL) {
            response.error = "No documents found";
            return response;
        }

        const fetchResponse = await fetch(DirectorAgreementSignedURL);
        const arrayBuffer = await fetchResponse.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        const form = pdfDoc.getForm();
        const fields = form.getFields();
        const fieldNames = fields.map(field => field.getName());

        console.log("Form fields: ", fieldNames);

        const currentDate = new Date().toISOString().split('T')[0];
        const signatureField = form.getTextField(`signature`);
        await pdfDoc.embedFont(StandardFonts.Helvetica);

        if (signatureField) {
            signatureField.setFontSize(10);
            signatureField.setText(signature);
        }

        const pdfBytes = await pdfDoc.save();
        writeFileSync(join(__dirname, 'signed-director-document.pdf'), pdfBytes);
        const { key, fileName } = getKeyAndFileNameFromAmazonS3Url(DirectorAgreementURL);
        return { success: true, data: pdfBytes, key, fileName };
    } catch (error: any) {
        response.error = error.message || "An error occurred";
    }

    return response;
}

const getKeyAndFileNameFromAmazonS3Url = (url: string) => {
    const urlParts = url.split('amazonaws.com/');
    const keyArray = urlParts[1].split('/');
    const fileName: string = keyArray[keyArray.length - 1];
    const key: string = keyArray.slice(0, -1).join('/');
    return { key, fileName };
}