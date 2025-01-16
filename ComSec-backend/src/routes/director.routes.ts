import express from 'express';
import { validateGuestUserType, validationJWT } from '../middlewares/validation.middleware';
import { getDirectorDocuments, signDirectorDocuments } from '../controller/director.controller';


const router = express.Router();

// ============================= DASHBOARD ================================
 
router.get('/get-director-documents/:company_id',
    validateGuestUserType(["director"]),
    getDirectorDocuments
);


router.post('/sign-documents',
    validateGuestUserType(["director"]),
    signDirectorDocuments
);


export default router;