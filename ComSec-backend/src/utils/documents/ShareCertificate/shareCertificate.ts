import { PDFDocument, rgb, StandardFonts, sum } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';
import logger from '../../logger';
import uploadPdfToS3 from '../../uploadToS3/upload';
// import { getCompanyDetailedInfo } from '../../../db/multi-user';

export const fillShareCertificate = async (data: any, shareHolderId: number, companyId: number, outputPath?: string) => {

    // const data: any = await getCompanyDetailedInfo(2);
    // data = await getCompanyDetailedInfo(2);
    // console.log(data);
    const shareHolder = data.shareHolders
    const shares = data.shares;
    const shareClassToDetailMapping = shares.reduce((acc: any, share: any) => {
        acc[share.class] = {
            totalProposed: share.totalProposed,
            currency: share.currency,
            unitPrice: share.unitPrice,
            total: share.total,
        };
        return acc;
    }, {});

    if (!shareHolder) {
        logger.error(`Shareholder with id ${shareHolderId} not found`);
        return;
    }

    // loop on shareholder
    const shareHolderSharesCertificates = await Promise.all(shareHolder.map(async (holder: any) => {

        const response: {response: any, class: string}[] = await Promise.all(holder.sharesDetails.map(async (share: any) => {
            console.log(JSON.stringify(share, null, 2));
            // Load the existing PDF
            const ShareCertificate = fs.readFileSync(__dirname + '/share_cert.pdf');
            const pdfDoc = await PDFDocument.load(ShareCertificate);

            pdfDoc.registerFontkit(fontkit);
            // const fontBytes = fs.readFileSync(path.join(__dirname, 'path_to_your_font.ttf'));
            // pdfDoc.embedFont(fontBytes);

            // Get the form
            const form = pdfDoc.getForm();

            const certificateData = {
                certificateNumber: '',
                noOfShares: ""+share.noOfShares,
                companyNumber: '',
                numberAndClass: share.classOfShares,
                valueOfShares: `${shareClassToDetailMapping[share.classOfShares].currency} ${share.noOfShares * shareClassToDetailMapping[share.classOfShares].unitPrice}`,
                dateOfIssue: new Date(data?.createdAt).toLocaleDateString('en-GB'),
                director: `${data.directors?.[0]?.name || ''}  ${data.directors?.[0]?.surname || ''}`,
                witness: `${data.companySecretary?.name || ''}  ${data.companySecretary?.surname || ''}`,
                comsec: data.companySecretary?.name + ' ' + data.companySecretary?.surname,
                comsecAddress: `${data.address?.flatFloor || ''}, ${data.address?.building || ''}, ${data.address?.street || ''}, ${data.address?.city || ''}, ${data.address?.district || ''}`.trim(),
                comsecOccupation: 'Secretary',
                date: new Date(data?.createdAt).toLocaleDateString('en-GB'),
                physicalAddress: holder.address,
                shareholderName: holder.name + ' ' + holder.surname,
                retailCompanyName1_2: '',
                retailCompanyName1_1: data.nameEnglish,
            };

            console.log(certificateData);
            form.getTextField('Certificate Number 1').setText(certificateData.certificateNumber);
            form.getTextField('Number of shares 1').setText(certificateData.noOfShares);
            form.getTextField('company number 1').setText(certificateData.companyNumber);
            form.getTextField('Number and class 1').setText(certificateData.numberAndClass);
            form.getTextField('value of shares 1').setText(certificateData.valueOfShares);
            form.getTextField('date of issue 1').setText(certificateData.dateOfIssue);
            form.getTextField('Director 1').setText(certificateData.director);
            form.getTextField('Witness 1').setText(certificateData.witness);
            form.getTextField('comsec 1').setText(certificateData.comsec);
            form.getTextField('com sec address 1').setText(certificateData.comsecAddress);
            form.getTextField('comsec occupation 1').setText(certificateData.comsecOccupation);
            form.getTextField('Date 1').setText(certificateData.date);
            form.getTextField('physical address 1').setText(certificateData.physicalAddress);
            form.getTextField('Share holder name 1').setText(certificateData.shareholderName);
            form.getTextField('retail company name 1_2').setText(certificateData.retailCompanyName1_2);
            form.getTextField('retail company name 1_1').setText(certificateData.retailCompanyName1_1);

            // Save the filled PDF
            const pdfBytes = await pdfDoc.save();
            const docLink = await uploadPdfToS3(pdfBytes, `company_documents/${companyId}`, `ShareCertificate_${shareHolderId}_${share.classOfShares}.pdf`);
            return {
                docLink,
                class: share.classOfShares,
            };
            // fs.writeFileSync(outputPath || path.join(__dirname, `filled_share_cert${share.classOfShares}.pdf`), pdfBytes);
        }));
        return {
            response,
            holderId: holder.id,
        }
    }));

    return shareHolderSharesCertificates;

}


// fillShareCertificate({}, 11);