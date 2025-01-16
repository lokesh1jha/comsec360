import express from 'express';
import { createNewAccountUser, deleteAccountUser, getAccountUsers, getAccountUsersCount, updateAccountUserDetails } from '../controller/user.controller';
import { validateRequest, validationJWT } from '../middlewares/validation.middleware';
import { AccountUserSchema } from '../utils/validationSchemas';

const router = express.Router();

//get all account users
router.get('/list',
    validationJWT(["admin"]),
    getAccountUsers
);

// get account users count    
router.get('/count',
    validationJWT(["admin"]),
    getAccountUsersCount
);

//register account user
router.post('/create',
    validateRequest(AccountUserSchema),
    // validationJWT(["admin"]),
    createNewAccountUser
);

//register account user
router.put('/update/:id',
    validateRequest(AccountUserSchema),
    validationJWT(["admin"]),
    updateAccountUserDetails
);


router.delete('/delete/:id',
    validationJWT(["admin"]),
    deleteAccountUser
);



export default router;
