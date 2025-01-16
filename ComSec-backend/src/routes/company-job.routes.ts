
import express from 'express';
import { validationJWT } from '../middlewares/validation.middleware';
import { getCompanyDocuments, getCompanyDocumentsCount, getNotification, produceAndEmailAllDoc } from '../controller/company-job.controller';
import { checkCompanyDetails } from '../controller/company-job.controller';

const router = express.Router();


router.get('/produce-all-doc-email-all/:company_id',
  validationJWT(["account_user"]),
  produceAndEmailAllDoc
);

router.get('/check-company-details/:company_id',
  validationJWT(["account_user"]),
  checkCompanyDetails
);

router.get('/get-notification',
  validationJWT(["account_user"]),
  getNotification
);


router.get('/is-document-generated/:company_id',
  validationJWT(["account_user"]),
  getCompanyDocumentsCount
);


export default router;
