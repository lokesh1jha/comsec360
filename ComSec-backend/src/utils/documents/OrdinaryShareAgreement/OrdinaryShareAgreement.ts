import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
// import { writeFileSync } from 'fs';
// import { join } from 'path';
// import { getCompanyDetailedInfo } from '../../../db/multi-user';

interface Party {
    name: string;
    shares: string;
    role: string;
    sharesHeld: number;
    consideration: string;
    pricePerShare: string;
    idNo: string
}

export interface OrdinaryShareAgreementType {
    effectiveDate: string;
    parties: Party[];
    totalShares: number;
    totalPaidUp: string;
}

const generateHTML = (data: OrdinaryShareAgreementType): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shareholders’ Agreement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0 20px;
        }
        h1, h2 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        .signature {
            margin-top: 40px;
        }
        .signature div {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <h1>Shareholders’ Agreement</h1>

    <p>This Agreement is entered into on ${data.effectiveDate} (the “Effective Date”)</p>

    <h2>Between</h2>

    ${data.parties.map(party => `<p>${party.name}</p>`).join('')}

    <p>Individually a “Party” and/or “Co-Founder”, and collectively the “Parties” and/or “Founders”</p>

    <h2>Whereas</h2>

    <p>The Parties have resolved to launch Company Name (the “Company”), a business venture to be incorporated in Hong Kong SAR, offering software solutions for streamlining and helping corporates manage company registration, company secretarial and corporate documents.</p>

    <h2>1. ALLOCATION OF SHARES</h2>

    <p><strong>1.1</strong> The initial allocation of ordinary shares and primary roles in the Company shall be as follows:</p>

    <table>
        <thead>
            <tr>
                <th>Party / Co-Founder</th>
                <th>Initial Allocation of Ordinary Shares</th>
                <th>Primary Roles</th>
            </tr>
        </thead>
        <tbody>
            ${data.parties.map(party => `
            <tr>
                <td>${party.name}</td>
                <td>${party.shares}</td>
                <td>${party.role}</td>
            </tr>`).join('')}
        </tbody>
    </table>

    <p><strong>1.2</strong> Each Party shall inject the requisite capital to achieve their initial ordinary shareholding. The following is the considerations among the Parties.</p>

    <table>
        <thead>
            <tr>
                <th>Name of shareholders</th>
                <th>No. of shares held by each shareholder</th>
                <th>Consideration for new shares</th>
                <th>Price per share</th>
            </tr>
        </thead>
        <tbody>
            ${data.parties.map(party => `
            <tr>
                <td>${party.name}</td>
                <td>${party.sharesHeld}</td>
                <td>${party.consideration}</td>
                <td>${party.pricePerShare}</td>
            </tr>`).join('')}
        </tbody>
    </table>

    <p>The total number of shares is ${data.totalShares}, and the total initial paid-up amount is ${data.totalPaidUp}.</p>

    <p><strong>1.3</strong> Each Party’s ordinary shareholding in the Company is issued on a pari-passu basis, and shall be equally subject to the Company’s rights and obligations, dividends and dilution from future share issuances, etc.</p>

    <h2>2. FOUNDERS’ OBLIGATIONS AND VESTING PROVISIONS</h2>

    <p><strong>2.1</strong> Each Party shall serve as a member of the Board of Directors, and may, upon approval of the Board of Directors, be appointed as employees of the Company.</p>
    <p><strong>2.2</strong> No Party shall serve as a director, employee, advisor or business introducer to any firm or business deemed to be in direct competition with the Company.</p>
    <p><strong>2.4</strong> In the event that a Party’s directorship and/or employment is terminated, voluntarily or involuntarily for any reason, or a Party suffers from permanent incapacitation, or passes away, all unvested shares shall be cancelled and/or returned to the treasury of the Company and/or repurchased at entry cost.</p>
    <p><strong>2.5</strong> It is further agreed that if any Party is deemed to bring the Company into disrepute, by virtue of proven fraudulent actions towards the Company and/or criminal conviction, the Company shall have the irrevocable right to terminate the aforementioned Party’s participation as a director and/or employee, and acquire the aforementioned Party’s entire shareholding in the Company for a nominal sum of HK$1.00.</p>

    <h2>3. SALE OF SHARES</h2>

    <p><strong>3.1</strong> Right of First Refusal: If any Party wishes to sell, transfer or otherwise dispose of any or all of his/her shares, the other Parties shall have a prior right to buy such shares.</p>
    <p><strong>3.2</strong> Tag Along: If a Group of shareholders comprising a simple majority of common shares receives an External Offer to sell their shares, the Group shall not be entitled to sell, transfer or otherwise dispose of their shares unless the Offerer purchases on the same terms the shares of any Party who so wishes to sell.</p>
    <p><strong>3.3</strong> Drag Along: If a Group of shareholders comprising a super majority of common shares (defined as 70% and above) wishes to accept an External Offer to acquire the entire Company, then all Parties shall be compelled to sell their shares on the same terms.</p>

    <h2>4. TERMINATION</h2>

    <p><strong>4.1</strong> This Agreement shall terminate upon any of the following circumstances:</p>
    <ul>
        <li>The Company is voluntarily or involuntarily wound up.</li>
        <li>The Company is acquired or achieves a public listing.</li>
        <li>It is superceded or cancelled by unanimous agreement of the Parties.</li>
    </ul>

</body>
</html>
`;

export const generateOrdinaryShareAgreementPDF = async (data: OrdinaryShareAgreementType): Promise<Uint8Array<ArrayBufferLike>> => {

    const html = generateHTML(data);

    // Use Puppeteer to generate the PDF with the HTML content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
            top: '20mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        },
    });
    await browser.close();

    // Use pdf-lib to add form fields (like signature fields) to the PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const form = pdfDoc.getForm();

    // Add a new page for signatures
    const signaturePage = pdfDoc.addPage([pdfDoc.getPage(0).getWidth(), pdfDoc.getPage(0).getHeight()]);

    // Add the "GOVERNING LAW" section to the new page
    signaturePage.drawText('5. GOVERNING LAW', { x: 50, y: signaturePage.getHeight() - 50, size: 18, font: await pdfDoc.embedFont('Helvetica-Bold') });
    signaturePage.drawText('5.1 This Agreement shall be governed under the laws of Hong Kong SAR.', { x: 50, y: signaturePage.getHeight() - 80, size: 12 });

    // Add signature fields for each party
    data.parties.forEach((party: Party, index: number): void => {
        const yPosition = signaturePage.getHeight() - 120 - index * 100;

        // Add party details
        signaturePage.drawText(`${party.name}`, { x: 50, y: yPosition, size: 12 });
        signaturePage.drawText(`Passport / ID No.: ${party.idNo}`, { x: 50, y: yPosition - 20, size: 12 });
        signaturePage.drawText('Date:', { x: 50, y: yPosition - 40, size: 12 });

        // Add a text field for each party's signature
        const dateField = form.createTextField(`date-${party.idNo}`);
        dateField.setText(''); // Default to empty
        dateField.addToPage(signaturePage, {
            x: 85,
            y: yPosition - 55,
            width: 100,
            height: 30,
        });

        const signatureField = form.createTextField(`signature-${party.idNo}`);
        signatureField.setText(''); // Default to empty
        signatureField.addToPage(signaturePage, {
            x: 200,
            y: yPosition - 55,
            width: 360,
            height: 30,
        });
    });

    // Save the PDF with the form fields
    const pdfBytes = await pdfDoc.save();
    // const outputPath = join(__dirname, 'output.pdf');
    // writeFileSync(outputPath, pdfBytes);
    return pdfBytes;

};



// async function testing() {
//     const getFullInfoOnCompany = await getCompanyDetailedInfo(2)
//     if (!getFullInfoOnCompany) {
//         throw new Error('Company not found');
//     }
//     const { createdAt, shareHolders, shares } = getFullInfoOnCompany;
//     const totalShares = shares.reduce((acc: number, share: any) => acc + share.totalProposed, 0);
//     const shareClassDetails = shares.reduce((acc: any, share: any) => {
//         if (!acc[share.class]) {
//             acc[share.class] = {
//                 unitPrice: share.unitPrice,
//                 currency: share.currency,
//                 totalProposed: share.totalProposed,
//                 total: share.total
//             };
//         }
//         return acc;
//     }, {});
    
//     const OrdinaryShareAggrementData: OrdinaryShareAgreementType = {
//         effectiveDate: new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
//         parties: shareHolders.map((shareHolder: any) => {
//             const shareDetails = shareHolder.sharesDetails.map((share: any) => {
//                 return {
//                     shares: `${((share.noOfShares / totalShares) * 100).toFixed(1)}%`,
//                     sharesHeld: share.noOfShares,
//                     consideration: `${shareClassDetails[share.classOfShares].currency} ${share.noOfShares}`,
//                     pricePerShare: `${shareClassDetails[share.classOfShares].currency} ${(shareClassDetails[share.classOfShares].unitPrice).toFixed(2)}`
//                 };
//             });
//             const combinedConsideration: string = shareDetails.map((detail: { consideration: string }) => detail.consideration).join('<br>');
//             const combinedPricePerShare: string = shareDetails.map((detail: { pricePerShare: string }) => detail.pricePerShare).join('<br>');

//             return {
//                 name: shareHolder.name,
//                 shares: `${(shareDetails.reduce((acc: any, detail: { sharesHeld: any; }) => acc + detail.sharesHeld, 0) / totalShares * 100).toFixed(2)}%`,
//                 role: shareHolder.role || '',
//                 sharesHeld: shareDetails.reduce((acc: any, detail: { sharesHeld: any; }) => acc + detail.sharesHeld, 0),
//                 consideration: combinedConsideration,
//                 pricePerShare: combinedPricePerShare,
//                 idNo: shareHolder.idNo
//             };
//         }),
//         totalShares: shares.reduce((acc: number, share: any) => acc + share.totalProposed, 0),
//         totalPaidUp: `${shares[0].currency} ${shares.reduce((acc: number, share: any) => acc + share.total, 0)}`
//     };
//     await generateOrdinaryShareAgreementPDF(OrdinaryShareAggrementData)

// }

// testing().then(() => console.log('done')).catch(console.error)