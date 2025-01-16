import { PDFDocument, rgb, StandardFonts, sum } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';
import logger from '../../logger';

const NNC1FormMap: { [key: string]: string } = {
    "fill_1_P.1": "nameEnglish",
    "fill_2_P.1": "nameChinese",
    "cb_1_P.1": "type_private",
    "cb_2_P.1": "type_public",
    "fill_3_P.1": "code",
    "fill_4_P.1": "natureOfBusiness",
    "fill_5_P.1": "address.flatFloor",
    "fill_6_P.1": "address.building",
    "fill_7_P.1": "address.street",
    "fill_8_P.1": "address.district",
    "fill_9_P.1": "presentorReference.nameChinese",
    "fill_10_P.1": "presentorReference.nameEnglish",
    "fill_11_P.1": "presentorReference.address",
    "fill_12_P.1": "presentorReference.telephone",
    "fill_13_P.1": "presentorReference.fax",
    "fill_14_P.1": "presentorReference.email",
    "fill_15_P.1": "presentorReference.presentorsReferance",

    "fill_1_P.2": "email",
    "fill_2_P.2": "telephone",
    "fill_3_P.2": "shares.class.1",
    "fill_4_P.2": "shares.totalProposed.1",
    "fill_5_P.2": "shares.currency.1",
    "fill_6_P.2": "shares.total.1",
    "fill_7_P.2": "shares.paid.1",
    "fill_8_P.2": "shares.unpaid.1",
    "fill_9_P.2": "shares.class.2",
    "fill_10_P.2": "shares.totalProposed.2",
    "fill_11_P.2": "shares.currency.2",
    "fill_12_P.2": "shares.total.2",
    "fill_13_P.2": "shares.paid.2",
    "fill_14_P.2": "shares.unpaid.2",
    "fill_15_P.2": "shares.totalProposed.3",
    "fill_16_P.2": "shares.currency.1",
    "fill_17_P.2": "shares.total.1",
    "fill_18_P.2": "shares.paid.1",
    "fill_19_P.2": "shares.unpaid.1",
    "fill_20_P.2": "shares.currency.2",
    "fill_21_P.2": "shares.total.2",
    "fill_22_P.2": "shares.paid.2",
    "fill_23_P.2": "shares.unpaid.2",
    "fill_24_P.2": "shares.classOfShare5A",
    "fill_25_P.2": "shares.rightsAttached5A",

    // "fill_1_P.3": "shareHolders.founderMemberChineseName", // no chinese name for founders or say shareholder
    "fill_2_P.3": "shareHolders.surname.1",
    "fill_3_P.3": "shareHolders.name.1",
    "fill_4_P.3": "shareHolders.founderMemberEnglishNameOr",
    "fill_5_P.3": "shareHolders.address.1",
    // "fill_6_P.3": "shareHolders.founderMemberBuilding",
    // "fill_7_P.3": "shareHolders.founderMemberStreet",
    // "fill_8_P.3": "shareHolders.founderMemberDistrict",
    // "fill_9_P.3": "shareHolders.founderMemberCountryRegion",
    //---------------HANDLED BELOW ------------------------------
    // "fill_10_P.3": "shareHolders.sharesDetails.founderMemberClassOfShares.1",
    // "fill_11_P.3": "shareHolders.sharesDetails.founderMemberTotalNumber.1",
    // "fill_12_P.3": "shareHolders.sharesDetails.founderMemberCurrency.1",
    // "fill_13_P.3": "shareHolders.sharesDetails.founderMemberTotalAmount.1",
    // "fill_14_P.3": "shareHolders.sharesDetails.founderMemberClassOfShares.2",
    // "fill_15_P.3": "shareHolders.sharesDetails.founderMemberTotalNumber.2",
    // "fill_16_P.3": "shareHolders.sharesDetails.founderMemberCurrency.2",
    // "fill_17_P.3": "shareHolders.sharesDetails.founderMemberTotalAmount.2",
    // "fill_18_P.3": "shareHolders.sharesDetails.founderMemberTotalValue",
    // "fill_19_P.3": "shareHolders.sharesDetails.founderMemberCurrency.3",
    // "fill_20_P.3": "shareHolders.sharesDetails.founderMemberCurrency.4",
    // "fill_21_P.3": "shareHolders.sharesDetails.founderMemberTotalAmount.3",
    // "fill_22_P.3": "shareHolders.sharesDetails.founderMemberTotalAmount.4",
    // -------------------------TILL HERE -------------------------

    // "fill_1_P.4": "firstSecretaryChineseName",
    // "fill_2_P.4": "companySecretary.surname",
    // "fill_3_P.4": "companySecretary.name",
    // "fill_4_P.4": "firstSecretaryPreviousChineseName",
    // "fill_5_P.4": "firstSecretaryPreviousEnglishName",
    // "fill_6_P.4": "firstSecretaryAliasChineseName",
    // "fill_7_P.4": "firstSecretaryAliasEnglishName",
    // "fill_8_P.4": "companySecretary.address",
    // "fill_9_P.4": "firstSecretaryBuilding",
    // "fill_10_P.4": "firstSecretaryStreet",
    // "fill_11_P.4": "firstSecretaryDistrict",
    // "fill_12_P.4": "companySecretary.email",
    // "fill_14_P.4": "firstSecretaryHKIDPartial",
    // "fill_15_P.4": "firstSecretaryPassportCountry",
    // "fill_16_P.4": "companySecretary.idNo",
    // "fill_17_P.4": "firstSecretaryLicenceNo",
    // "fill_18_P.4": "firstSecretaryNoLicenceReason",
    // "cb_1_P.4": "notRequiredToLicence",

    "fill_1_P.7": "firstDirectorChineseName",
    "fill_2_P.7": "firstDirectorEnglishName",
    "fill_3_P.7": "firstDirectorAddress",
    "fill_4_P.7": "firstDirectorFlatFloor",
    "fill_5_P.7": "firstDirectorBuilding",
    "fill_6_P.7": "firstDirectorStreet",
    "fill_7_P.7": "firstDirectorDistrict",
    "fill_8_P.7": "firstDirectorCountryRegion",
    "fill_9_P.7": "firstDirectorEmail",
    "fill_10_P.7": "firstDirectorBusinessRegNumber",
    "fill_11_P.7": "firstDirectorConsent",
    "fill_12_P.7": "firstDirectorSigned",
    "fill_13_P.7": "firstDirectorName",
    "fill_14_P.7": "firstDirectorPosition",
};

export const fillNNC1Form = async (getAllInfoOnCompany: any, outputPath?: string) => {

    // console.log(getAllInfoOnCompany)
    // console.log(getAllInfoOnCompany.shareHolders[0].sharesDetails)
    // Load the existing PDF
    const NNC1_Form_Start = fs.readFileSync(__dirname + '/NNC1_Form_Start.pdf');
    const pdfDoc = await PDFDocument.load(NNC1_Form_Start);

    pdfDoc.registerFontkit(fontkit);
    //load font and embed it to pdf document
    const fontBytesEnglish = fs.readFileSync(path.join(__dirname, '../../fonts', 'houschka-pro-bold.ttf'));
    const fontBytesChinese = fs.readFileSync(path.join(__dirname, '../../fonts', 'NotoSansSC-Regular.ttf'));
    await pdfDoc.embedFont(fontBytesEnglish);
    const fontChinese = await pdfDoc.embedFont(fontBytesChinese); // TODO: still issue in chinese

    // Get the form
    const form = pdfDoc.getForm();
    // console.log(form.getFields());

    // list all possible fields in pdf
    const fields = form.getFields();
    // const fieldsk = fields.map((f) => f.getName());
    // console.log(fields);
    // Extract shares information
    const shares = getAllInfoOnCompany?.shares || [];
    const sumOfTotalProposed = shares.reduce((sum: number, share: any) => sum + (share.totalProposed || 0), 0);
    const classList = shares.map((share: any) => share.class).join('\n');
    const rightsAttachedList = shares.map((share: any) => share.rightsAttached).join('\n');


    // console.log('Class List:', classList);
    // console.log('Rights Attached List:', rightsAttachedList);

    fields.forEach(field => {
        try {
            const fieldName = field.getName();
            if (field.constructor.name === 'PDFTextField') {
                const fieldMapping: string = NNC1FormMap[fieldName] || "";

                if (fieldMapping) {
                    let fieldValue: string = '';
                    if (fieldMapping.indexOf(".") !== -1) {
                        const [parentKey, childKey, index] = fieldMapping.split('.');
                        // console.log(parentKey, childKey)
                        if (!index) {
                            const getValueFromNestedObject: string = "" + ((getAllInfoOnCompany as any)?.[parentKey]?.[childKey] ?? '');
                            const textField = form.getTextField(fieldName);
                            textField.setText(getValueFromNestedObject);
                            if (childKey.includes("Chinese")) {
                                textField.updateAppearances(fontChinese);
                            }
                            // console.log(form.getTextField(fieldName).getText(), "in pdf")
                        } else {
                            const arrayValue = (getAllInfoOnCompany as any)?.[parentKey];
                            if (Array.isArray(arrayValue) && arrayValue[parseInt(index) - 1]) {
                                fieldValue = "" + (arrayValue[parseInt(index) - 1]?.[childKey] ?? '');
                                const textField = form.getTextField(fieldName);
                                textField.setText(fieldValue);
                                if (childKey.includes("Chinese")) {
                                    textField.updateAppearances(fontChinese);
                                }
                            }
                        }
                    } else {
                        fieldValue = (getAllInfoOnCompany as any)?.[fieldMapping] || '';
                        const textField = form.getTextField(fieldName);
                        textField.setText(fieldValue);
                        if (fieldMapping.includes("Chinese")) {
                            textField.updateAppearances(fontChinese);
                        }
                    }
                }
            } else if (field.constructor.name === 'PDFCheckBox') {
                // console.log("all ", fieldName);
                let companyTypeCbFieldName: string;

                if (getAllInfoOnCompany?.type == 'PRIVATE') {
                    companyTypeCbFieldName = "cb_1_P.1"
                } else {
                    companyTypeCbFieldName = "cb_2_P.1"
                }
                if (companyTypeCbFieldName) form.getCheckBox(companyTypeCbFieldName).check();
            }
        } catch (e) {
            logger.log("Error in filling field", e);
            throw e;
        }
    });

    const sharesList = getAllInfoOnCompany?.shares

    const classToCurrencyAndUnitPrice: { [key: string]: { currency: string, unitPrice: number } } = {};
    sharesList.forEach((share: any) => {
        classToCurrencyAndUnitPrice[share.class] = {
            currency: share.currency,
            unitPrice: share.unitPrice
        };
    });

    // page 2
    const shareCapitalDetails = getAllInfoOnCompany?.shares || [];
    let totalShareSum = 0;

    if (shareCapitalDetails.length > 0) {
        let classStr1 = '';
        let numStr1 = '';
        let currStr1 = '';
        let amtStr1 = '';
        let paid1 = '';
        let unpaid1 = '';

        let classStr2 = '';
        let numStr2 = '';
        let currStr2 = '';
        let amtStr2 = '';
        let paid2 = '';
        let unpaid2 = '';

        const half = Math.floor((shareCapitalDetails.length - 1) / 2);

        for (let i = 0; i < shareCapitalDetails.length; i++) {
            if (i <= half) {
                classStr1 += shareCapitalDetails[i]?.class + '\n';
                numStr1 += shareCapitalDetails[i]?.total + '\n';
                currStr1 += shareCapitalDetails[i].currency + '\n';
                amtStr1 += shareCapitalDetails[i]?.totalProposed + '\n';
                paid1 += shareCapitalDetails[i]?.paid + '\n';
                unpaid1 += shareCapitalDetails[i]?.unpaid + '\n';
            } else {
                classStr2 += shareCapitalDetails[i]?.class + '\n';
                numStr2 += shareCapitalDetails[i]?.total + '\n';
                currStr2 += shareCapitalDetails[i].currency + '\n';
                amtStr2 += shareCapitalDetails[i]?.totalProposed + '\n';
                paid2 += shareCapitalDetails[i]?.paid + '\n';
                unpaid2 += shareCapitalDetails[i]?.unpaid + '\n';
            }
            totalShareSum += shareCapitalDetails[i]?.total;
        }

        form.getTextField("fill_3_P.2").setText(classStr1.trim());
        form.getTextField("fill_4_P.2").setText(numStr1.trim());
        form.getTextField("fill_5_P.2").setText(currStr1.trim());
        form.getTextField("fill_6_P.2").setText(amtStr1.trim());
        form.getTextField("fill_7_P.2").setText(paid1.trim());
        form.getTextField("fill_8_P.2").setText(unpaid1.trim());

        form.getTextField("fill_9_P.2").setText(classStr2.trim());
        form.getTextField("fill_10_P.2").setText(numStr2.trim());
        form.getTextField("fill_11_P.2").setText(currStr2.trim());
        form.getTextField("fill_12_P.2").setText(amtStr2.trim());
        form.getTextField("fill_13_P.2").setText(paid2.trim());
        form.getTextField("fill_14_P.2").setText(unpaid2.trim());
    }

    const currencyTotalMap: { [key: string]: number } = {};
    const currencyPaidMap: { [key: string]: number } = {};
    const currencyUnpaidMap: { [key: string]: number } = {};

    shareCapitalDetails.forEach((share: any) => {
        const currency = classToCurrencyAndUnitPrice[share.class].currency || '';
        const totalValue = share.totalProposed || 0;
        const paidValue = share.paid || 0;
        const unpaidValue = share.unpaid || 0;

        if (currencyTotalMap[currency]) {
            currencyTotalMap[currency] += totalValue;
            currencyPaidMap[currency] += paidValue;
            currencyUnpaidMap[currency] += unpaidValue;
        } else {
            currencyTotalMap[currency] = totalValue;
            currencyPaidMap[currency] = paidValue;
            currencyUnpaidMap[currency] = unpaidValue;
        }
    });

    form.getTextField("fill_15_P.2").setText("" + totalShareSum);

    const currencyKeys = Object.keys(currencyTotalMap);
    const halfCurrency = Math.floor(currencyKeys.length / 2);

    let currStr1 = '';
    let totalStr1 = '';
    let paidStr1 = '';
    let unpaidStr1 = '';

    let currStr2 = '';
    let totalStr2 = '';
    let paidStr2 = '';
    let unpaidStr2 = '';

    for (let i = 0; i < currencyKeys.length; i++) {
        if (i < halfCurrency) {
            currStr1 += currencyKeys[i] + '\n';
            totalStr1 += currencyTotalMap[currencyKeys[i]] + '\n';
            paidStr1 += currencyPaidMap[currencyKeys[i]] + '\n';
            unpaidStr1 += currencyUnpaidMap[currencyKeys[i]] + '\n';
        } else {
            currStr2 += currencyKeys[i] + '\n';
            totalStr2 += currencyTotalMap[currencyKeys[i]] + '\n';
            paidStr2 += currencyPaidMap[currencyKeys[i]] + '\n';
            unpaidStr2 += currencyUnpaidMap[currencyKeys[i]] + '\n';
        }
    }

    form.getTextField("fill_16_P.2").setText(currStr1.trim());
    form.getTextField("fill_17_P.2").setText(totalStr1.trim());
    form.getTextField("fill_18_P.2").setText(paidStr1.trim());
    form.getTextField("fill_19_P.2").setText(unpaidStr1.trim());

    form.getTextField("fill_20_P.2").setText(currStr2.trim());
    form.getTextField("fill_21_P.2").setText(totalStr2.trim());
    form.getTextField("fill_22_P.2").setText(paidStr2.trim());
    form.getTextField("fill_23_P.2").setText(unpaidStr2.trim());


    // form.getTextField("fill_15_P.2").setText("" + sumOfTotalProposed);


    form.getTextField("fill_24_P.2").setText(classList);
    form.getTextField("fill_25_P.2").setText(rightsAttachedList);


    // ------------------- Page 3 -------START--------- Shareholder -------------
    // Share details of shareHolder[0] as only one shareholder is allowed on this page
    const sharesDetails = getAllInfoOnCompany?.shareHolders[0]?.sharesDetails || [];
    let sumOfTotalShare = 0;

    if (sharesDetails.length > 0) {

        let classStr1 = '';
        let numStr1 = '';
        let currStr1 = '';
        let amtStr1 = '';

        let classStr2 = '';
        let numStr2 = '';
        let currStr2 = '';
        let amtStr2 = '';

        const half = Math.floor((sharesDetails.length - 1) / 2);

        for (let i = 0; i < sharesDetails.length; i++) {
            if (i <= half) {
                classStr1 += sharesDetails[i]?.classOfShares + '\n';
                numStr1 += sharesDetails[i]?.noOfShares + '\n';
                currStr1 += classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].currency + '\n';
                amtStr1 += (classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].unitPrice * sharesDetails[i]?.noOfShares) + '\n';
            } else {
                classStr2 += sharesDetails[i]?.classOfShares + '\n';
                numStr2 += sharesDetails[i]?.noOfShares + '\n';
                currStr2 += classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].currency + '\n';
                amtStr2 += (classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].unitPrice * sharesDetails[i]?.noOfShares) + '\n';
            }
            sumOfTotalShare += sharesDetails[i]?.noOfShares;
        }


        form.getTextField("fill_10_P.3").setText(classStr1.trim());
        form.getTextField("fill_11_P.3").setText(numStr1.trim());
        form.getTextField("fill_12_P.3").setText(currStr1.trim());
        form.getTextField("fill_13_P.3").setText(amtStr1.trim());

        form.getTextField("fill_14_P.3").setText(classStr2.trim());
        form.getTextField("fill_15_P.3").setText(numStr2.trim());
        form.getTextField("fill_16_P.3").setText(currStr2.trim());
        form.getTextField("fill_17_P.3").setText(amtStr2.trim());

    }

    const currencyMap: { [key: string]: number } = {};
    sharesDetails.forEach((share: any) => {
        const currency = classToCurrencyAndUnitPrice[share.classOfShares].currency || '';
        const totalValue = share.noOfShares || 0;
        if (currencyMap[currency]) {
            currencyMap[currency] += totalValue;
        } else {
            currencyMap[currency] = totalValue;
        }
    });

    form.getTextField("fill_18_P.3").setText("" + sumOfTotalShare);

    const currencies = Object.keys(currencyMap);
    if (currencies.length > 0) {
        form.getTextField("fill_19_P.3").setText("" + currencies[0]);
        form.getTextField("fill_20_P.3").setText("" + currencyMap[currencies[0]]);
    }
    if (currencies.length > 1) {
        form.getTextField("fill_21_P.3").setText("" + currencies[1]);
        form.getTextField("fill_22_P.3").setText("" + currencyMap[currencies[1]]);
    }

    // ------------------- Page 3 --------END-------- Shareholder -------------


    // ---------------- Page 4 -------START--------- Person Secretary -------------
    const companySecretary = getAllInfoOnCompany?.companySecretary || {};
    if (companySecretary.type && companySecretary.type.toLowerCase() === 'person') {
        form.getTextField("fill_2_P.4").setText(companySecretary.surname || '');
        form.getTextField("fill_3_P.4").setText(companySecretary.name || '');
        form.getTextField("fill_8_P.4").setText(companySecretary.address || '');
        form.getTextField("fill_12_P.4").setText(companySecretary.email || '');

        form.getTextField("fill_15_P.4").setText(companySecretary.idNo.substring(0, 6));
        if (companySecretary.tcspLicenseNo) {
            form.getTextField("fill_16_P.4").setText(companySecretary.tcspLicenseNo);
        }
        else {
            form.getCheckBox("cb_1_P.4").check();
            form.getTextField("fill_17_P.4").setText(getAllInfoOnCompany?.companySecretary?.tcspReason);
        }

    }
    // ----------------- Page 4 --------END-------- Person Secretary -------------
    // ----------------- Page 5 -------START--------- Company Secretary -------------
    else if (companySecretary.type && companySecretary.type.toLowerCase() === 'company') {
        const fullName = companySecretary.name + " " + (companySecretary.surname || '');
        form.getTextField("fill_2_P.5").setText(fullName);
        form.getTextField("fill_3_P.5").setText(companySecretary.address || '');
        form.getTextField("fill_7_P.5").setText(companySecretary.email || '');
        form.getTextField("fill_8_P.5").setText(companySecretary.idNo.substring(0, 8));
        if (companySecretary.tcspLicenseNo) {
            form.getTextField("fill_9_P.5").setText(companySecretary.tcspLicenseNo);
        }
        else {
            form.getCheckBox("cb_1_P.5").check();
            form.getTextField("fill_10_P.5").setText(getAllInfoOnCompany?.companySecretary?.tcspReason);
        }
    }
    // ----------------- Page 5 --------END-------- Company Secretary -------------


    const firstDirector = getAllInfoOnCompany?.directors[0] || {};
    if (firstDirector.type && firstDirector.type.toLowerCase() === 'person') {
        // ---------------- Page 6 -------START--------- First Director -------------
        if (firstDirector.type && firstDirector.type.toLowerCase() === 'person') {
            form.getTextField("fill_2_P.6").setText(firstDirector.surname);
            form.getTextField("fill_3_P.6").setText(firstDirector.name);
            form.getTextField("fill_8_P.6").setText(firstDirector.address);
            form.getTextField("fill_13_P.6").setText(firstDirector.email);
            form.getTextField("fill_16_P.6").setText(firstDirector.idNo.substring(0, 8));

            // checkbox
            form.getCheckBox("cb_1_P.6").check();
            form.getCheckBox("cb_2_P.6").check();
        }
        else if (firstDirector.type && firstDirector.type.toLowerCase() === 'company') {
            form.getTextField("fill_2_P.7").setText(firstDirector.nameEnglish);
            form.getTextField("fill_3_P.7").setText(firstDirector.address);
            form.getTextField("fill_8_P.7").setText(firstDirector.email);
            form.getTextField("fill_9_P.7").setText(firstDirector.idNo.substring(0, 8));
            // checkbox
            form.getCheckBox("cb_1_P.7").check();
            form.getCheckBox("cb_2_P.7").check();
        }
        // ---------------- Page 6 --------END-------- First Director -------------
    }
    else if (firstDirector.type && firstDirector.type.toLowerCase() === 'company') {
        // ---------------- Page 7 -------START--------- First Director -------------
        form.getTextField("fill_1_P.7").setText(firstDirector.nameChinese);
        form.getTextField("fill_2_P.7").setText(firstDirector.nameEnglish);
        form.getTextField("fill_3_P.7").setText(firstDirector.address);
        form.getTextField("fill_8_P.7").setText(firstDirector.email);
        form.getTextField("fill_9_P.7").setText(firstDirector.idNo.substring(0, 8));
        // checkbox
        form.getCheckBox("cb_1_P.7").check();
        form.getCheckBox("cb_2_P.7").check();
        // ---------------- Page 7 --------END-------- First Director -------------
    }

    // ---------------- Page 8 -------START--------- Statement of Founder Member -------------
    const countOfShareHolders = getAllInfoOnCompany?.shareHolders.length;
    let countOfPersonDirectors = getAllInfoOnCompany?.directors.filter((director: any) => director.type.toLowerCase() === 'person').length;
    let countOfCompanyDirectors = getAllInfoOnCompany?.directors.filter((director: any) => director.type.toLowerCase() === 'company').length;
    // what type was the oth index of director
    const directorType = getAllInfoOnCompany?.directors[0]?.type;
    if (directorType && directorType.toLowerCase() === 'person') {
        countOfPersonDirectors--;
    } else {
        countOfCompanyDirectors--;
    }
    if (countOfShareHolders > 1) form.getTextField("fill_1_P.8").setText("" + (countOfShareHolders - 1));
    if (countOfPersonDirectors > 0) form.getTextField("fill_4_P.8").setText("" + (countOfPersonDirectors));
    if (countOfCompanyDirectors > 0) form.getTextField("fill_5_P.8").setText("" + (countOfCompanyDirectors));
    // ---------------- Page 8 --------END-------- Statement of Founder Member -------------

    // Page 9  - Details of Founder Members (Section 6)
    // Need to duplicate the Page nine for each founder member i.e share holders in this case [from 1st index]
    const shareHolders = getAllInfoOnCompany?.shareHolders.slice(1) || []; // remove 0th index as it is already filled

    const foundingMemberPdfBytes = fs.readFileSync(path.join(__dirname, 'Founding_Members_SheetA.pdf'));
    const foundingMemberPdfDoc = await PDFDocument.load(foundingMemberPdfBytes);
    let currentNumberOfPages = pdfDoc.getPageCount();

    const Founding_Members_SheetA = fs.readFileSync(__dirname + '/Founding_Members_SheetA.pdf');
    const Founding_Members_SheetA_pdfDoc = await PDFDocument.load(Founding_Members_SheetA);
    Founding_Members_SheetA_pdfDoc.registerFontkit(fontkit);
    const NNC1form = Founding_Members_SheetA_pdfDoc.getForm();

    // list all possible fields in pdf
    // const NNC1fields = NNC1form.getFields();
    // const NNC1fieldsk = NNC1fields.map((f) => f.getName());
    // console.log(NNC1fieldsk);
    for (const shareHolder of shareHolders) {
        const fullName = shareHolder.name + " " + (shareHolder.surname || '');
        NNC1form.getTextField("fill_4_P.9").setText(fullName);
        NNC1form.getTextField("fill_5_P.9").setText(shareHolder.address);

        const sharesDetails = shareHolder.sharesDetails || [];
        let sumOfTotalShare = 0;

        let classStr1 = '';
        let numStr1 = '';
        let currStr1 = '';
        let amtStr1 = '';

        let classStr2 = '';
        let numStr2 = '';
        let currStr2 = '';
        let amtStr2 = '';

        const half = Math.floor((sharesDetails.length - 1) / 2);

        for (let i = 0; i < sharesDetails.length; i++) {
            if (i <= half) {
                classStr1 += sharesDetails[i]?.classOfShares + '\n';
                numStr1 += sharesDetails[i]?.noOfShares + '\n';
                currStr1 += classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].currency + '\n';
                amtStr1 += (classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].unitPrice * sharesDetails[i]?.noOfShares) + '\n';
            } else {
                classStr2 += sharesDetails[i]?.classOfShares + '\n';
                numStr2 += sharesDetails[i]?.noOfShares + '\n';
                currStr2 += classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].currency + '\n';
                amtStr2 += (classToCurrencyAndUnitPrice[sharesDetails[i]?.classOfShares].unitPrice * sharesDetails[i]?.noOfShares) + '\n';
            }
            sumOfTotalShare += sharesDetails[i]?.noOfShares;
        }

        // const [foundingMemberPage] = await foundingMemberPdfDoc.copyPages(foundingMemberPdfDoc, [0]);
        // foundingMemberPdfDoc.addPage(foundingMemberPage);
        // const tempForm = foundingMemberPdfDoc.getForm();

        if (classStr1.length > 0) {
            NNC1form.getTextField("fill_10_P.9").setText(classStr1.trim());
            NNC1form.getTextField("fill_11_P.9").setText(numStr1.trim());
            NNC1form.getTextField("fill_12_P.9").setText(currStr1.trim());
            NNC1form.getTextField("fill_13_P.9").setText(amtStr1.trim());
        }

        if (classStr2.length > 0) {
            NNC1form.getTextField("fill_14_P.9").setText(classStr2.trim());
            NNC1form.getTextField("fill_15_P.9").setText(numStr2.trim());
            NNC1form.getTextField("fill_16_P.9").setText(currStr2.trim());
            NNC1form.getTextField("fill_17_P.9").setText(amtStr2.trim());
        }

        const currencyMap: { [key: string]: number } = {};
        sharesDetails.forEach((share: any) => {
            const currency = classToCurrencyAndUnitPrice[share.classOfShares].currency || '';
            const totalValue = share.noOfShares || 0;
            if (currencyMap[currency]) {
                currencyMap[currency] += totalValue;
            } else {
                currencyMap[currency] = totalValue;
            }
        });

        NNC1form.getTextField("fill_18_P.9").setText("" + sumOfTotalShare);

        const currencies = Object.keys(currencyMap);
        if (currencies.length > 0) {
            NNC1form.getTextField("fill_19_P.9").setText("" + currencies[0]);
            NNC1form.getTextField("fill_20_P.9").setText("" + currencyMap[currencies[0]]);
        }
        if (currencies.length > 1) {
            NNC1form.getTextField("fill_21_P.9").setText("" + currencies[1]);
            NNC1form.getTextField("fill_22_P.9").setText("" + currencyMap[currencies[1]]);
        }

        const tempPdfBytes = await Founding_Members_SheetA_pdfDoc.save();
        const tempPdfDocLoaded = await PDFDocument.load(tempPdfBytes);
        const [tempPage] = await pdfDoc.copyPages(tempPdfDocLoaded, [0]);
        pdfDoc.addPage(tempPage);
    }

    // Page 12 - Details of First Directors (Natural Person) (Section 8A)
    // Page 13 - Details of First Directors (Body Corporate) (Section 8B)
    // Have to duplicate the page for each director i.e directors in this case [from 1st index] 
    // and director type is person or company will decide which page to fill
    const directors = getAllInfoOnCompany?.directors.slice(1) || []; // remove 0th index as it is already filled

    const firstDirectorPersonPdfBytes = fs.readFileSync(path.join(__dirname, 'First_Director_Person_SheetD.pdf'));
    const firstDirectorCompanyPdfBytes = fs.readFileSync(path.join(__dirname, 'First_Director_Company_SheetD.pdf'));

    const firstDirectorPersonPdfDoc = await PDFDocument.load(firstDirectorPersonPdfBytes);
    const firstDirectorCompanyPdfDoc = await PDFDocument.load(firstDirectorCompanyPdfBytes);

    firstDirectorPersonPdfDoc.registerFontkit(fontkit);
    const DirectorPersonForm = firstDirectorPersonPdfDoc.getForm();

    firstDirectorCompanyPdfDoc.registerFontkit(fontkit);
    const DirectorCompanyForm = firstDirectorCompanyPdfDoc.getForm();

    // list all possible fields in pdf
    // const Directorfields = DirectorPersonForm.getFields();
    // const Directorfieldsk = Directorfields.map((f) => f.getName());
    // console.log(Directorfieldsk);
    for (const director of directors) {
        if (director.type && director.type.toLowerCase() === 'person') {
            DirectorPersonForm.getTextField("fill_2_P.12").setText(director.surname);
            DirectorPersonForm.getTextField("fill_3_P.12").setText(director.name);
            DirectorPersonForm.getTextField("fill_8_P.12").setText(director.address);
            DirectorPersonForm.getTextField("fill_13_P.12").setText(director.email);
            DirectorPersonForm.getTextField("fill_16_P.12").setText(director.idNo.substring(0, 8));
            DirectorPersonForm.getCheckBox("cb_1_P.12").check();
            DirectorPersonForm.getCheckBox("cb_2_P.12").check();

            const tempPdfBytes = await firstDirectorPersonPdfDoc.save();
            const tempPdfDocLoaded = await PDFDocument.load(tempPdfBytes);
            const [tempPage] = await pdfDoc.copyPages(tempPdfDocLoaded, [0]);
            pdfDoc.addPage(tempPage);
        } else if (director.type && director.type.toLowerCase() === 'company') {
            DirectorCompanyForm.getTextField("fill_2_P.13").setText(director.name);
            DirectorCompanyForm.getTextField("fill_3_P.13").setText(director.address);
            DirectorCompanyForm.getTextField("fill_8_P.13").setText(director.email);
            DirectorCompanyForm.getTextField("fill_9_P.13").setText(director.idNo.substring(0, 8));
            DirectorCompanyForm.getCheckBox("cb_1_P.13").check();
            DirectorCompanyForm.getCheckBox("cb_2_P.13").check();

            const tempPdfBytes = await firstDirectorCompanyPdfDoc.save();
            const tempPdfDocLoaded = await PDFDocument.load(tempPdfBytes);
            const [tempPage] = await pdfDoc.copyPages(tempPdfDocLoaded, [0]);
            pdfDoc.addPage(tempPage);
        }
    }

    // Load the NNC1_Form_End.pdf
    const NNC1_Form_End = fs.readFileSync(path.join(__dirname, 'NNC1_Form_End.pdf'));
    const endPdfDoc = await PDFDocument.load(NNC1_Form_End);

    // Copy all pages from NNC1_Form_End.pdf to the main pdf
    const endPages = await pdfDoc.copyPages(endPdfDoc, endPdfDoc.getPageIndices());
    endPages.forEach((page) => {
        pdfDoc.addPage(page);
    });


    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    return pdfBytes

    // Write the PDF to a file
    // fs.writeFileSync(outputPath ?? "./", pdfBytes);
}

// Testing usage
// async function example() {
//     try {

//         const getAllInfoOnCompany = await getCompanyDetailedInfo(2)
//         const res = await fillNNC1Form(getAllInfoOnCompany, __dirname + '/newoutput.pdf')
//         console.log("Pdf created successfully");
//     }
//     catch (e) {
//         console.log("err", e)
//     }
// }

//  example()