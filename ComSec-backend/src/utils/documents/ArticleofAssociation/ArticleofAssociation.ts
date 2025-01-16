import puppeteer from "puppeteer";
import path from 'path';
import fs from 'fs/promises';

interface CompanyInfo {
    englishName: string;
    chineseName: string;
    shareCapitalDetails: {
        shareCapital: number;
        sharesIssued: number;
        founderName: string;
        shareAmount: number;
    }[];
}

function generateArticles(data: CompanyInfo): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Articles of Association</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
            }
            h1, h2, h3 {
                text-align: center;
                margin-bottom: 0;
            }
            p {
                margin: 10px 0;
            }
            .section {
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            table th, table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            table th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>THE COMPANIES ORDINANCE (CHAPTER 622)</h1>
        <h2>Private Company Limited by Shares</h2>
        <h2>ARTICLES OF ASSOCIATION</h2>
        <h2>OF</h2>
        <h3>${data.englishName}</h3>
        <h3>${data.chineseName}</h3>
        <br>
  
        <div class="section">
            <h3>Part A Mandatory Articles</h3>
            <p><strong>1. Company Name:</strong> The name of the company is:</p>
            <p style="text-align: center;">“${data.englishName}<br>${data.chineseName}”</p>
            <p><strong>2. Members’ Liabilities:</strong></p>
            <p>The liability of the members is limited.</p>
            <p><strong>3. Liabilities or Contributions of Members:</strong></p>
            <p>The liability of the members is limited to any amount unpaid on the shares held by the members.</p>
            <p><strong>4. Share Capital and Initial Shareholdings (on the company’s formation):</strong></p>
            <table>
                <tr>
                    <td>The total number of shares that the company proposes to issue:</td>
                    <td>${data.shareCapitalDetails.reduce((total, detail) => total + detail.sharesIssued, 0)}</td>
                </tr>
                <tr>
                    <td>The total amount of share capital to be subscribed by the company’s founder members:</td>
                    <td>HKD${data.shareCapitalDetails.reduce((total, detail) => total + detail.shareCapital, 0)}</td>
                </tr>
                <tr>
                    <td>(i) The amount to be paid up or to be regarded as paid up:</td>
                    <td>HKD${data.shareCapitalDetails.reduce((total, detail) => total + detail.shareCapital, 0)}</td>
                </tr>
                <tr>
                    <td>(ii) The amount to remain unpaid or to be regarded as remaining unpaid:</td>
                    <td>HKD0</td>
                </tr>
            </table>
        </div>
  
        <div class="section">
            <h3>Class of Shares</h3>
            <table>
                <tr>
                    <td>The total number of shares in this class that the company proposes to issue:</td>
                    <td>${data.shareCapitalDetails.reduce((total, detail) => total + detail.sharesIssued, 0)}</td>
                </tr>
                <tr>
                    <td>The total amount of share capital in this class to be subscribed by the company’s founder members:</td>
                    <td>HKD${data.shareCapitalDetails.reduce((total, detail) => total + detail.shareCapital, 0)}</td>
                </tr>
                <tr>
                    <td>(i) The amount to be paid up or to be regarded as paid up:</td>
                    <td>HKD${data.shareCapitalDetails.reduce((total, detail) => total + detail.shareCapital, 0)}</td>
                </tr>
                <tr>
                    <td>(ii) The amount to remain unpaid or to be regarded as remaining unpaid:</td>
                    <td>HKD0</td>
                </tr>
            </table>
        </div>
  
        <div class="section">
            <p>I/WE, the undersigned, wish to form a company and wish to adopt the articles of association as attached, and I/we respectively agree to subscribe for the amount of share capital of the Company and to take the number of shares in the Company set opposite my/our respective name(s).</p>
        </div>
  
        <table>
            <thead>
                <tr>
                    <th>Name(s) of Founder Members</th>
                    <th>Number of Share(s)</th>
                    <th>Total Amount of Share Capital</th>
                </tr>
            </thead>
            <tbody>
                ${data.shareCapitalDetails.map(detail => `
                <tr>
                    <td>${detail.founderName}</td>
                    <td>${detail.sharesIssued}<br>[Ordinary] shares</td>
                    <td>HKD${detail.shareCapital}</td>
                </tr>`).join('')}
                <tr>
                    <td>Total:</td>
                    <td>${data.shareCapitalDetails.reduce((total, detail) => total + detail.sharesIssued, 0)}<br>[Ordinary] shares</td>
                    <td>HKD${data.shareCapitalDetails.reduce((total, detail) => total + detail.shareCapital, 0)}</td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    `;
}



export const generateArticleOfAssociationPDF = async (data: any): Promise<Uint8Array> => {
    const html = generateArticles(data); // Function to generate HTML content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    // Generate PDF with Puppeteer
    const tempPdfPath = path.resolve(__dirname, 'temp.pdf');
    await page.pdf({
        path: tempPdfPath, // Save Puppeteer-generated PDF to a file
        format: 'A4',
        margin: {
            top: '20mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm',
        },
        printBackground: true,
    });

    // Dynamically import pdf-merger-js
    const { default: PDFMerger } = await import('pdf-merger-js');
    const merger = new PDFMerger();

    // Add PDFs to the merger
    const AAStartPath = path.resolve(__dirname, 'AA-start.pdf');
    const AAEndPath = path.resolve(__dirname, 'AA-end.pdf');
    await merger.add(AAStartPath);
    await merger.add(tempPdfPath); // Add Puppeteer-generated PDF
    await merger.add(AAEndPath);

    // Save merged PDF to a buffer
    const mergedPdfPath = path.resolve(__dirname, 'merged.pdf');
    await merger.save(mergedPdfPath);

    // Read the merged PDF as a buffer
    const mergedPdf = await fs.readFile(mergedPdfPath);

    // Clean up temporary files
    await fs.unlink(tempPdfPath);
    await fs.unlink(mergedPdfPath);

    await browser.close();
    return mergedPdf;
};
