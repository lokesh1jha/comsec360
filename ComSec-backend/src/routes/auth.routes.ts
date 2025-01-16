import express from 'express';
import { loginUser } from '../controller/user.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { AuthFormSchema } from '../utils/validationSchemas';

const router = express.Router();


router.post('/login',
    validateRequest(AuthFormSchema),
    loginUser
);

export default router;
