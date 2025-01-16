import express from 'express';
import { validateGuestUserType, validationJWT } from '../middlewares/validation.middleware';
import { getShareholderDocuments, signShareholderDocuments } from '../controller/shareholder.controller';


const router = express.Router();

// ============================= DASHBOARD ================================
 
router.get('/get-shareholder-documents/:company_id',
    validateGuestUserType(["shareholder"]),
    getShareholderDocuments
);


router.post('/sign-documents',
    validateGuestUserType(["shareholder"]),
    signShareholderDocuments
);


export default router;