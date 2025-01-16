import express from 'express';
import { getDashboardCountController, getProjectDetailsController, getProjectsController } from '../controller/multi-user.controller';
import { validationJWT } from '../middlewares/validation.middleware';
import { getCompanyDocuments, uploadNNC1Form } from '../controller/company-job.controller';
import multer from 'multer';
import { addGovernmentDocuments } from '../controller/account-user.controller';


const router = express.Router();

// ============================= DASHBOARD ================================

// get dashboard count 
router.get('/dashboard-count',
    validationJWT(["account_user"]),
    getDashboardCountController
);

/* Will be applied later
// get compnaies for dashboard company tab
router.get('/companies',
    validationJWT(["account_user"]),
    getCompaniesController
);
*/

// get projects for dahsboard project tab
router.get('/projects',
    validationJWT(["account_user"]),
    getProjectsController
);


router.get('/user-details/:projectId',
    validationJWT(["account_user"]),
    getProjectDetailsController
)

router.get('/documents/:company_id',
    validationJWT(["account_user"]),
    getCompanyDocuments
);

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload-company-nnc1-form/:id/:position',
    validationJWT(["account_user"]),
    upload.single('file'),
    uploadNNC1Form
);

router.post('/add-company-documents/obtain-documents/:company_id',
    validationJWT(["account_user"]),
    upload.fields([
        { name: 'certificateOfIncorporate', maxCount: 1 },
        { name: 'notice', maxCount: 1 },
        { name: 'reciepts', maxCount: 1 }
    ]),
    addGovernmentDocuments
);

export default router;