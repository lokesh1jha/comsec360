import express from 'express';
import { validateRequest, validationJWT } from '../middlewares/validation.middleware';
import { addDirectorByAccountUser, addOrUpdateSecretaryByAccountUser, addOrUpdateShareCapitalByAccountUser, addShareHolderByAccountUser, changePassword, deleteCompanyDirector, deleteCompanyShareHolder, deleteShareCapital, getCompanyCount, getCompanyDetails, getDirectors, getSecretary, getShareCapitals, getShareHolders, sendInviteToDirectors, sendInviteToShareholder, submitCompanyDetails, updateDirectorByAccountUser, updateShareHolderByAccountUser, uploadCompanyLogo, uploadShareHolderIdProof } from '../controller/account-user.controller';
import { CompanyInfoFormSchema, CompanySecretaryFormSchema, DirectorInviteFormSchema, DirectorsFormSchema, DirectorsUpdateFormSchema, InviteFormSchema, ShareCapitalFormSchema, ShareholdersFormSchema, ShareholdersUpdateFormSchema } from '../utils/validationSchemas';
import multer from 'multer';

const storage = multer.memoryStorage();

const router = express.Router();


// -------START:  upload company logo ------------
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const upload = multer({ storage: storage, fileFilter: fileFilter , limits: { fileSize: 5 * 1024 * 1024 }});

  // update logo
  router.post('/upload-company-logo/:company_id',
    upload.single('file'),
    uploadCompanyLogo
  );

  // upload
  router.post('/upload-company-logo',
    upload.single('file'),
    uploadCompanyLogo
  );


// -------END:  upload company logo ------------
  

// ---------------- company details ----------------------
router.post('/submit-company-details/:company_id',
    validateRequest(CompanyInfoFormSchema),
    validationJWT(["account_user"]),
    submitCompanyDetails
);

router.post('/submit-company-details',
  validateRequest(CompanyInfoFormSchema),
  validationJWT(["account_user"]),
  submitCompanyDetails
);

router.get('/get-company-details/:company_id',
    validationJWT(["account_user"]),
    getCompanyDetails
);


// ---------------- share capital ----------------------
router.post("/add-comapny-sharecapital/:company_id",
  validateRequest(ShareCapitalFormSchema),
  validationJWT(["account_user"]),
  addOrUpdateShareCapitalByAccountUser
)

router.get("/get-companies-sharecapital/:company_id",
  validationJWT(["account_user", "guest"]),
  getShareCapitals
)


router.put("/update-comapny-sharecapital/:company_id/:share_capital_id",
  validateRequest(ShareCapitalFormSchema),
  validationJWT(["account_user"]),
  addOrUpdateShareCapitalByAccountUser
)

router.delete("/delete-comapny-sharecapital/:company_id/:share_capital_id",
  validationJWT(["account_user"]),
  deleteShareCapital
)

// ---------------- share holders ----------------------
router.post("/add-comapny-shareholder/:company_id",
  validateRequest(ShareholdersFormSchema),
  validationJWT(["account_user"]),
  addShareHolderByAccountUser
)

router.put("/update-comapny-shareholder/:company_id",
  validateRequest(ShareholdersUpdateFormSchema),
  validationJWT(["account_user"]),
  updateShareHolderByAccountUser
)
router.post("/upload-id-proof-file/:company_id",
  upload.single('file'),
  validationJWT(["account_user", "guest"]),
  uploadShareHolderIdProof
)

router.post("/invite-guest-user-shareholder/:company_id",
  validateRequest(InviteFormSchema),
  validationJWT(["account_user", "guest"]),
  sendInviteToShareholder
)

router.get("/get-companies-shareholders/:company_id",
  validationJWT(["account_user"]),
  getShareHolders
)

router.delete("/delete-comapny-shareholder/:company_id/:shareholder_id",
  validationJWT(["account_user"]),
  deleteCompanyShareHolder
)
// ---------------- Directors ----------------------

// add and update
router.post("/add-comapny-directors/:company_id",
  validateRequest(DirectorsFormSchema),
  validationJWT(["account_user"]),
  addDirectorByAccountUser
)

router.post("/invite-guest-user-directors/:company_id",
  validateRequest(DirectorInviteFormSchema),
  validationJWT(["account_user"]),
  sendInviteToDirectors
)

router.put("/update-comapny-directors/:company_id/",
  validateRequest(DirectorsUpdateFormSchema),
  validationJWT(["account_user"]),
  updateDirectorByAccountUser
)


router.get("/get-companies-directors/:company_id",
  validationJWT(["account_user"]),
  getDirectors
)


router.delete("/delete-comapny-directors/:company_id/:director_id",
  validationJWT(["account_user"]),
  deleteCompanyDirector
)


//=================== Company Secretary ==================


// add and update
router.post("/add-comapny-Secretary/:company_id",
  validateRequest(CompanySecretaryFormSchema),
  validationJWT(["account_user"]),
  addOrUpdateSecretaryByAccountUser
)


// router.post("/update-comapny-Secretary/:company_id/",
//   validateRequest(SecretaryFormSchema),
//   validationJWT(["account_user"]),
//   addOrUpdateSecretaryByAccountUser
// )


router.get("/get-companies-Secretary/:company_id",
  validationJWT(["account_user"]),
  getSecretary
)


// router.delete("/delete-comapny-Secretary/:company_id/:director_id",
//   validationJWT(["account_user"]),
//   deleteCompanyDirector
// )


// ---------------- Multiple Account User ----------------------

router.get('/get-company-count',
  validationJWT(["account_user"]),
  getCompanyCount
);

router.put('/change-password',
  validationJWT(["account_user"]),
  changePassword
);

export default router;
