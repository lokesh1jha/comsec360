import fs from 'fs';
import puppeteer from 'puppeteer';
// import { getCompanyDetailedInfo } from '../../../db/multi-user';
import { PDFDocument, rgb } from 'pdf-lib';
// import { generatePresignedUrl } from '../../s3Upload';

// Mock Data
// const mockData = {
//     companyNumber: "123456c12",
//     companyName: "Pika",
//     companyChineseName: "腾讯游戏",
//     companyLogo: "logo.png",
//     date: "24-20/7",
//     time: "10:00 AM",
//     place: "Park Street, Eastern District, Hong Kong",
//     present: ["Ma Heuteng"],
//     chairman: "Ma Heuteng",
//     incorporationDate: "18-03-2024",
//     founders: [
//         { name: "Ma Heuteng", shares: "9,000 Ordinary" },
//         { name: "Tony Zhang", shares: "1,000 Ordinary" }
//     ],
//     registeredOffice: "Park Street, East and West District, Hong Kong",
//     registersLocation: "Park Street, East and West District",
//     chairmanSignature: "Ma Heuteng",
//     footer: "Picka"
// };

// HTML Content
interface Founder {
    name: string;
    shares: string;
}

interface MockData {
    companyNumber: string;
    companyName: string;
    companyChineseName: string;
    companyLogo: string;
    date: string;
    time: string;
    place: string;
    present: string[];
    chairman: string;
    incorporationDate: string;
    founders: Founder[];
    registeredOffice: string;
    registersLocation: string;
    chairmanSignature: string;
    footer: string;
}

const generateHtmlContent = (mockData: MockData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mockData.companyName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.2;
            margin: 0;
            padding: 10px;
            display: flex;
            flex-direction: column;

        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 40px;
        }
        .header img {
            height: 50px;
            width: 50px;
        }
        .content {
            padding-bottom: 50mm; /* Space reserved for the footer */
            padding: 20px;
        }
        .heading {
            text-align: center;
        }
        .subContent {
            padding: 20px;
        }
        
        .footer {
            text-align: center;
            font-size: 0.5em;
            padding: 10px;
            width: 100%;
            position: fixed;
            bottom: 0;
            margin-top: auto; /* Pushes the footer to the bottom */
        }

        .name-signature {
            display: flex;
            justify-content: space-between; /* Ensures name and signature are at opposite ends */
            align-items: center; /* Vertically centers the items */
            margin-top: 10px; /* Adds spacing between rows */
        }
        .signature {
            margin-left: auto; /* Ensures the signature moves to the right */
            text-align: right;
        }
        .content, .subContent {
            padding-left: 40px;
            padding-right: 20px;
        }
        .founder {
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>Company No.: ${mockData.companyNumber}</div>
        <img src="${mockData.companyLogo}" alt="Company Logo">
    </div>

    <div class="content">
        <div class="heading">
            <h3>${mockData.companyName}</h3>
            <p>${mockData.companyChineseName}</p>
            <p>(Incorporated in Hong Kong)<br>
            (the “Company”)</p>
            <hr>
        </div>
        <h4>MINUTES OF THE FIRST MEETING OF DIRECTOR(S)</h4>
        <p>of the above-named Company held on the following date, and at the following time and place namely:</p>
        
        <div class="subContent">
            <p>Date: ${mockData.date}<br>
            Time: ${mockData.time}<br>
            Place: ${mockData.place}</p>
        </div>

        <hr>
        
        <h4>PRESENT:</h4>
        <p>
            ${mockData.present.map(person => `
                <div class="name-signature">
                    <span>${person}</span>
                    <span class="signature"><u>${person ? person.toUpperCase() : '' }</u></span>
                </div>`).join('')}
        </p>
        <h4>CHAIRMAN</h4>
        <p>${mockData.chairman} was elected Chairman of the meeting.</p>

        <h4>QUORUM</h4>
        <p>It was NOTED that due notice of this meeting had been given to the director(s) and a quorum
        was present and the Chairman declared the meeting duly convened and constituted.</p>

        <h4>INCORPORATION</h4>
        <p>It was NOTED that the Company was incorporated on ${mockData.incorporationDate} and a Certificate of Incorporation was tabled.</p>

        <h4>COMMON SEAL</h4>
        <p>It was RESOLVED that the seal, an impression of which is placed in the opposite side herein,
        be adopted as the Common Seal of the Company.</p>

        <h4>FIRST DIRECTOR(S)</h4>
        <p>It was NOTED that the following had been appointed as first director(s) of the Company by the founder member(s):<br>
        ${mockData.present.join('<br>')}</p>

        <h4>FIRST SECRETARY</h4>
        <p>It was NOTED that the following had been appointed as first secretary of the Company,<br>
        ${mockData.chairman}</p>

        <h4>FOUNDER'S SHARES</h4>
        <p>It was RESOLVED that share certificates be issued to the following founder member(s) under the Common Seal of the Company.<br>
        <br>
        ${mockData.founders.map(founder => `
            <div class="founder">
                <span>${founder.name}</span>
                <span>${founder.shares}</span>
            </div>`).join('')}</p>

        <h4>REGISTERED OFFICE</h4>
        <p>It was NOTED that the registered office of the Company be situated at the following address.<br>
        <br>
        ${mockData.registeredOffice.split(',').join(',<br>')}</p>

        <h4>LOCATION OF REGISTERS</h4>
        <p>It was RESOLVED that the registers of debenture holders, if any, charges, if any, copies of
        instruments creating such charges, if any, transfers, if any, members, directors, and secretaries,
        and minute books of the Company be kept at the following address(es) and that necessary
        notice(s) be filed with the Companies Registry in accordance with the Companies Ordinance.
        <div class="subContent">
        ${mockData.registersLocation.split(',').join(',<br>')}</div></p>
    </div>
    <div class="footer">
        ${mockData.footer}
    </div>
</body>
</html>`;




export const generateMinutesofMeetingPDF = async (data: any): Promise<Uint8Array<ArrayBufferLike>> => {
    const html = generateHtmlContent(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
        format: 'A4',
        margin: {
            top: '20mm',    // Top margin
            right: '10mm',  // Right margin
            bottom: '10mm', // Adjust bottom margin to reserve space for the footer
            left: '10mm'    // Left margin
        },
        printBackground: true,
    });

    const pdfDoc = await PDFDocument.load(pdf);
    const form = pdfDoc.getForm();
    const signaturePage = pdfDoc.addPage([pdfDoc.getPage(0).getWidth(), pdfDoc.getPage(0).getHeight()]);
    const yPosition = signaturePage.getHeight() - 120;
    signaturePage.drawText('END OF MEETING', { x: 50, y: signaturePage.getHeight() - 50, size: 18, font: await pdfDoc.embedFont('Helvetica-Bold') });
    signaturePage.drawText('There being no further business, the meeting was declared closed.', { x: 50, y: signaturePage.getHeight() - 80, size: 12 });

    const dateField = form.createTextField(`signature`);
    dateField.setText(''); // Default to empty
    dateField.addToPage(signaturePage, {
        x: 50,
        y: yPosition - 35,
        width: 130,
        height: 30,
    });
    
    signaturePage.drawText('CHAIRMAN', { x: 50, y: yPosition - 55, size: 12 });

    const pdfBytes = await pdfDoc.save();
    await browser.close();
    // fs.writeFileSync(__dirname + '/Minutes_Meeting.pdf', pdfBytes); // Testing purpose
    return pdfBytes;
    
};

// async function testing() {
//     const getFullInfoOnCompany = await getCompanyDetailedInfo(2)
//     if (!getFullInfoOnCompany) {
//         throw new Error('Company not found');
//     }
//     const { createdAt, shareHolders, presentorReference } = getFullInfoOnCompany;

//     const MinutesofMeetingData = {
//         companyNumber: getFullInfoOnCompany.id,
//         companyName: getFullInfoOnCompany.nameEnglish,
//         companyChineseName: getFullInfoOnCompany.nameChinese,
//         companyLogo: getFullInfoOnCompany.logo,//getFullInfoOnCompany.logo ? await generatePresignedUrl(getFullInfoOnCompany.logo) : '',
//         date: "24-20/7",
//         time: "10:00 AM",
//         place: "Park Street, Eastern District, Hong Kong",
//         present: presentorReference ? [presentorReference.nameEnglish] : [],
//         chairman: presentorReference ? presentorReference.nameEnglish : "",
//         incorporationDate: new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
//         founders: shareHolders.map((shareHolder: any) => ({
//             name: shareHolder.name,
//             shares: `${shareHolder.sharesDetails.map((share: any) => `${share.noOfShares} ${share.classOfShares}`).join(', ')}`
//         })),
//         registeredOffice: getFullInfoOnCompany.address.street,
//         registersLocation: getFullInfoOnCompany.address.street,
//         chairmanSignature: "             ",
//         footer: getFullInfoOnCompany.nameEnglish
//     };
//     generateMinutesofMeetingPDF(MinutesofMeetingData);

// }

// testing()