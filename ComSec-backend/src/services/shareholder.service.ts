import { getShareholderDocumentsDb } from "../db/upload-documents/shareholder"
import { generatePresignedUrl } from "../utils/s3Upload";
// import { signDocument } from "../utils/documentSigner";
import { getDocumentsByCompanyId } from "../db/company";
import { drawTextField, PDFDocument, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';
import { getShareHoldersById } from "../db/account-users/share-holders-query";
import { writeFileSync } from 'fs';
import { join } from 'path';


export const getShareholderDocumentsService = async (shareholderId: number, companyId: number) => {
    let response: { success: boolean, data: any, error: any } = { success: false, data: null, error: null };

    try {
        const { shareholderDocuments, documents, company } = await getShareholderDocumentsDb(shareholderId, companyId);

        if (!shareholderDocuments || !documents) {
            response.error = "No documents found";
            return response;
        }

        shareholderDocuments.NNC1Url = (shareholderDocuments.NNC1Url ? await generatePresignedUrl(shareholderDocuments.NNC1Url) : shareholderDocuments.NNC1Url) ?? '';
        shareholderDocuments.idProof = (shareholderDocuments.idProof ? await generatePresignedUrl(shareholderDocuments.idProof) : shareholderDocuments.idProof) ?? '';
        shareholderDocuments.addressProof = (shareholderDocuments.addressProof ? await generatePresignedUrl(shareholderDocuments.addressProof) : shareholderDocuments.addressProof) ?? '';
        shareholderDocuments.ordinaryShareAgreementUrl = (shareholderDocuments.ordinaryShareAgreementUrl ? await generatePresignedUrl(shareholderDocuments.ordinaryShareAgreementUrl) : shareholderDocuments.ordinaryShareAgreementUrl) ?? '';

        for (const document of documents) {
            document.url = (document.url ? await generatePresignedUrl(document.url) : document.url) ?? '';
        }

        response.success = true;
        response.data = { shareholderDocuments, documents, company };
    } catch (error: any) {
        response.error = error.message || "An error occurred";
    }

    return response;
}


export const signShareholderDocumentsService = async (shareholderId: number, companyId: number, signature: string) => {
    let response: { success: boolean, data: Uint8Array<ArrayBufferLike> | null, error: any, key: string, fileName: string } =
        { success: false, data: null, error: null, key: '', fileName: '' };

    try {
        const documnetUrl = await getDocumentsByCompanyId(companyId);
        const shareHolder = await getShareHoldersById(shareholderId);
        const shareHolderIdNo = shareHolder?.idNo;
        // const 
        console.log("documnetUrl: ", documnetUrl);

        const OrdinaryShareAgreementURL = documnetUrl.find((doc: any) => doc.name === "Ordinary Share Agreement")?.url;
        if (!OrdinaryShareAgreementURL || !shareHolderIdNo) {
            response.error = "No documents found";
            return response;
        }
        const OrdinaryShareAgreementSignedURL = await generatePresignedUrl(OrdinaryShareAgreementURL);
        if (!OrdinaryShareAgreementSignedURL) {
            response.error = "No documents found";
            return response;
        }
        // download the form as pdf and it is fillable form so list all form filds 
        const fetchResponse = await fetch(OrdinaryShareAgreementSignedURL);
        const arrayBuffer = await fetchResponse.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        const form = pdfDoc.getForm();
        const fields = form.getFields();
        const fieldNames = fields.map(field => field.getName());

        console.log("Form fields: ", fieldNames);
        // Fill the form fields with the provided signature and current date
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const dateField = form.getTextField(`date-${shareHolderIdNo}`);
        const signatureField = form.getTextField(`signature-${shareHolderIdNo}`);
        await pdfDoc.embedFont(StandardFonts.Helvetica);

        if (dateField) {
            dateField.setFontSize(10);
            dateField.setText(currentDate);
        } else {
            console.error(`Date field for shareholder ID ${shareHolderIdNo} not found`);
        }

        if (signatureField) {
            signatureField.setFontSize(10);
            signatureField.setText(signature);
        }

        // Save the filled PDF
        const pdfBytes = await pdfDoc.save();
        // const outputPath = join(__dirname, 'signedDocument.pdf');
        // writeFileSync(outputPath, pdfBytes);
        const { key, fileName } = getKeyAndFileNameFromAmamzonS3Url(OrdinaryShareAgreementURL);
        return { success: true, data: pdfBytes, key, fileName };
    } catch (error: any) {
        response.error = error.message || "An error occurred";
    }

    return response;
}


const getKeyAndFileNameFromAmamzonS3Url = (url: string) => {
    const urlParts = url.split('amazonaws.com/');
    const keyArray = urlParts[1].split('/')
    const fileName: string = keyArray[keyArray.length - 1];
    const key: string = keyArray.slice(0, -1).join('/');
    return { key, fileName };
}