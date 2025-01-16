import { Request, Response } from 'express';
import { createNewAccountUserService, deleteAccountUserService, getAllAccountUsersService, getAllUsersCountServiceByType, loginCheckUserService, UpdateAccountUserService } from '../services/user.service';
import bcrypt from "bcrypt";
import logger from '../utils/logger';
import { AccountUser, UserTypeObject } from '../types/constant';
import { newAccountUserEmailTemplate } from '../utils/email/templates/newAccountUserEmail';
import { sendEmail } from '../utils/email/sendEmail';
import { generateToken } from '../utils/jwt.utils';
import { getUsersByEmail } from '../db/user';
const ADMIN_EMAIL = process.env.SENDER_EMAIL || "lokesh9jha@gmail.com";


export const getAccountUsers = async (req: Request, res: Response) => {
  const users = await getAllAccountUsersService();
  logger.info("GetAccountUsers controller: ", users);
  res.status(200).json({ data: users });

};

export const getAccountUsersCount = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersCountServiceByType("account_user");
    logger.info("getAccountUsersCount controller: ", users);
    res.status(200).json({ data: users });
  } catch (error) {
    logger.error("Error occured in getAccountUsersCount controller: ", error);
    res.status(500).json({ error: error });
  }
}
export const createNewAccountUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    // check if email already exists
    const emailExists = await getUsersByEmail(user.email);
    if (emailExists) {
      res.status(400).json({ error: "Email already exists", message: "Email already exists. Please use a different email" });
      return;
    }

    // hash the password
    const saltRounds = 12;
    const rawPassword = user.password;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;

    // hardcode the type AS account_user
    user.type = UserTypeObject.account_user;

    // remove the confirm password as it is not needed
    delete user.confirmPassword;

    const result = await createNewAccountUserService(req.body);

    logger.info("CreateNewAccountUser controller: ", result);
    if (result.success) {
      const fullName: string = user.firstName + " " + user.lastname;
      const emailTemplate = newAccountUserEmailTemplate(fullName, user.email, rawPassword);

      sendEmail(emailTemplate, "Welcome to ComSec360, Get Started", user.email, ADMIN_EMAIL, "Welcome to ComSec360")
        .then(() => {
          logger.info("Email sent successfully");
        })
        .catch((error) => {
          logger.error("Error sending email: ", error);
        })

      res.status(201).json({ message: "Account User created successfully" });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    logger.error("Error occured in CreateNewAccountUser controller: ", error);
    res.status(500).json({ error: error });
  }
};

export const updateAccountUserDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user: AccountUser = req.body;

    const exsitingUser = await getUsersByEmail(user.email);

    if (!exsitingUser) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (exsitingUser.email !== user.email) {
      res.status(400).json({ error: "Email cannot be changed" });
      return;
    }

    const result = await UpdateAccountUserService(user, exsitingUser, id);
    res.json(result);
  } catch (error) {
    logger.error("Error occured in updateAccountUserDetails controller: ", error);
    res.status(500).json({ error: error });
  }
}

export const deleteAccountUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await deleteAccountUserService(id);
    res.json(result);
  } catch (error) {
    logger.error("Error occured in deleteAccountUser controller: ", error);
    res.status(500).json({ error: error });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.info("LoginAccountUser controller: ", req.body);
    const result = await loginCheckUserService(email, password);
    console.log(result);
    if (result.success) {
      // generate jwt token
      const { email, type, firstname, lastname } = result.data;
      const token = generateToken({ email, type, firstname, lastname });

      const user = result.data;
      delete user.password;

      res.status(201).json({ message: "User logged in successfully", token: token, user });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    logger.error("Error occured in loginAccountUser controller: ", error);
    res.status(500).json({ error: error });
  }
}

