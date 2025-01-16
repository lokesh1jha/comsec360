import express from 'express';
import { addDirectorByGuest, addGuestShareholder, addShareHolderByGuest, getDirectorInvite, getGuestDirectorContent, getGuestShareholderContent, getShareHolderInvite, verifyInvite } from '../controller/guest.controller';
import { validateRequest, validationJWT } from '../middlewares/validation.middleware';
import { GuestOTPSchema, GuestUserGetSchema, InvitedDirectorFormSchema, InvitedShareholdersFormSchema, ShareholdersFormSchema } from '../utils/validationSchemas';

const router = express.Router();


router.post('/verify-guest-otp',
    validateRequest(GuestOTPSchema),
    verifyInvite
)

router.get('/shareholder-page-content/:company_id',
    validationJWT(["guest"]),
    getGuestShareholderContent
);


// check if used
router.post('/add-shareholder',
    validateRequest(ShareholdersFormSchema),
    validationJWT(["guest"]),
    addGuestShareholder
);


router.post('/add-comapny-shareholder/:company_id',
    validateRequest(InvitedShareholdersFormSchema),
    validationJWT(["guest"]),
    addShareHolderByGuest
)

router.get('/get-shareholder-invite/:inviteId',
    validationJWT(["guest"]),
    getShareHolderInvite

)



router.post('/add-company-director/:company_id',
    validateRequest(InvitedDirectorFormSchema),
    validationJWT(["guest"]),
    addDirectorByGuest
)

router.get('/get-director-invite/:inviteId',
    validationJWT(["guest"]),
    getDirectorInvite
)

router.get('/get-company-directors/:company_id',
    validationJWT(["guest"]),
    getGuestDirectorContent
)

export default router;
