import { deleteUserById, getAccountUsers, getUsersByEmail, getUsersById, getUsersCountByType, insertUser, updateAccountUser } from "../db/user";
import { AccountUser } from "../types/constant";
import logger from "../utils/logger";
import bcrypt from "bcrypt";

type StandardResponseInerface = {
  success: boolean;
  data: any;
  error: any;
}


export const getAllAccountUsersService = async () => {
  let response : StandardResponseInerface = { success: false, data: null, error: null };
  try {
    const result = await getAccountUsers();

    if(!result) {
      response.error = "No account users found";
      response.data = [];
      return response;
    }

    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occured in createNewAccountUser service: ", error);

    response.error = error;
    return response;
  }
};

export const getAllUsersCountServiceByType = async (type: string) => {
  let response : StandardResponseInerface = { success: false, data: null, error: null };
  try {
    const result = await getUsersCountByType(type);
    console.log(result);
    if(!result) {
      response.error = "No account users found";
      response.data = 0;
      return response;
    }

    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occured in createNewAccountUser service: ", error);

    response.error = error;
    return response;
  }
};

export const createNewAccountUserService = async (user: any) => {
  let response : StandardResponseInerface = { success: false, data: null, error: null };
  try {
    const result = await insertUser(user);

    if(!result) {
      response.error = "Error creating account user";
      return response;
    }

    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occured in createNewAccountUser service: ", error);

    response.error = error;
    return response;
  }
};


export const loginCheckUserService = async (email: string, password: string) => {
  let response : StandardResponseInerface = { success: false, data: null, error: null };
  try {
    console.log("email", email, password);
    const result = await getUsersByEmail(email);
    console.log("result", result);
    if(!result) {
      response.error = "User not found";
      return response;
    }
    const hashedPassword = result?.password;

    if(!bcrypt.compareSync(password, hashedPassword)) {
      response.error = "Invalid password";
      return response;
    }
    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occured in createNewUser service: ", error);

    response.error = error;
    return response;
  }
}

export const UpdateAccountUserService = async (user: AccountUser, exsitingUser: AccountUser, id: string) => {
  let response : StandardResponseInerface = { success: false, data: null, error: null };
  try {
    
    // if password is not changed then keep the old password else hash the new password
    const hashedPassword = user.password === exsitingUser.password ? exsitingUser.password : await bcrypt.hash(user.password, 12);
    const updateUser = await updateAccountUser({ ...user, password: hashedPassword, id });
    
    if(!updateUser) {
      response.error = "Error updating account user";
      return response;
    }

    response.success = true;
    response.data = null //updateUser;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occured in updateAccountUser service: ", error);

    response.error = error;
    return response;
  }
}

export const deleteAccountUserService = async (id: string) => {
  let response : StandardResponseInerface = { success: false, data: null, error: null };
  try {
    const result = await getUsersById(id);
    if(!result) {
      response.error = "User not found";
      return response;
    }

    const deletedUser = await deleteUserById(id);
    
    if(!deletedUser) {
      response.error = "Error deleting account user";
      return response;
    }    

    response.success = true;
    response.data = null;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occured in createNewAccountUser service: ", error);

    response.error = error;
    return response;
  }
}