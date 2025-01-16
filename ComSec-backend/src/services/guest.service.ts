import { addNewShareholderFromInvite, getDirectorFromInviteTable, getInvitedShareHolderById, getInvitedShareHolderId, linkDirectorInviteToUser, linkShareholderInviteAndUserId, updateDirectorInviteExpiry, updateShareholderInviteExpiry } from "../db/guest";
import { getUsersById, insertUser } from "../db/user";
import { generateToken } from "../utils/jwt.utils";
import logger from "../utils/logger";

type StandardResponseInerface = {
  success: boolean;
  data: any;
  error: any;
}



const getInviteHandlers = (inviteType: string) => {
  switch (inviteType) {
    case "shareholder":
      return {
        getInviteDetails: getInvitedShareHolderById,
        updateInviteExpiry: updateShareholderInviteExpiry,
        linkInviteToUser: linkShareholderInviteAndUserId,
        defaultUserType: "guest",
      };
    case "director":
      return {
        getInviteDetails: getDirectorFromInviteTable,
        updateInviteExpiry: updateDirectorInviteExpiry,
        linkInviteToUser: linkDirectorInviteToUser,
        defaultUserType: "guest",
      };
    default:
      throw new Error("Invalid invite type.");
  }
};

// Helper function to create or link the user
const createOrLinkUser = async (
  inviteDetails: any,
  inviteId: number,
  email: string,
  userType: string,
  linkInviteToUser: Function
) => {
  let user = inviteDetails.userId
    ? await getUsersById(inviteDetails.userId)
    : await insertUser({
        email,
        type: userType,
        firstName: inviteDetails.name || "Guest",
        lastName: inviteDetails.surname || "User",
        password: "guestuser", // Set a default password for guest users
      });
  if (!user) {
    throw new Error("Error creating user.");
  }
  await linkInviteToUser(inviteId, user.id);
  return user;
};

// Main function to verify invite
export const verifyInviteService = async (id: number, email: string, otp: string, inviteType: string) => {
  const { getInviteDetails, updateInviteExpiry, linkInviteToUser, defaultUserType } = getInviteHandlers(inviteType);

  // Fetch invite details
  const inviteDetails  = await getInviteDetails(id, email, otp);
  if (!inviteDetails) {
    throw new Error("Invalid or expired invitation link.");
  }

  // Validate OTP and link expiry
  if (inviteDetails.otp !== otp) {
    throw new Error("Invalid OTP.");
  }
  if (inviteDetails.linkExpiry && inviteDetails.linkExpiry < new Date()) {
    throw new Error("Invitation link has expired.");
  }

  // Update expiry if not set
  if (!inviteDetails.linkExpiry) {
    const newExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    await updateInviteExpiry(id, newExpiry);
  }

  // Create or link user
  const user = await createOrLinkUser(inviteDetails, id, email, defaultUserType, linkInviteToUser);

  // Generate token
  const token = generateToken({
    email: user.email,
    type: user.type,
    firstname: user.firstName,
    lastname: user.lastName,
  });

  return token;
};

// Function to add shareholder from invite
export const addGuestShareholderService = async (data: any) => {
  let response: StandardResponseInerface = { success: false, data: null, error: null };
  try {
    const { inviteId } = data;
    data.type = data.type.toUpperCase();
    data.sharesDetails = data.shareDetails
    const result = await addNewShareholderFromInvite(inviteId, data);
    if (!result) {
      logger.error("Error in addGuestShareholderService");
      response.error = "Error in addGuestShareholderService";
      return response;
    }
    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error("Error occurred in addGuestShareholderService: ", error);
    response.error = error.message || error;
    return response;
  }
};

// Helper function for fetching invite details
export const getInviteDetailsFromTable = async (id: number, email: string, otp: string, inviteType: string) => {
  const response: StandardResponseInerface = { success: false, data: null, error: null }
  try {
    const { getInviteDetails } = getInviteHandlers(inviteType);
    const result = await getInviteDetails(id, email, otp);
    if (!result) {
      logger.error(`Error in getInviteDetailsFromTable for ${inviteType}`);
      response.error = `${inviteType} not found`;
      return response;
    }
    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error(`Error occurred in getInviteDetailsFromTable for ${inviteType}: `, error);
    response.error = error.message || error;
    return response;
  }
};

// Helper function to link invite to user
export const linkInviteToUserService = async (inviteId: number, userId: number, inviteType: string) => {
  const response: StandardResponseInerface = { success: false, data: null, error: null }
  try {
    const { linkInviteToUser } = getInviteHandlers(inviteType);
    const result = await linkInviteToUser(inviteId, userId);
    if (!result) {
      logger.error(`Error in linkInviteToUserService for ${inviteType}`);
      response.error = "Failed to link invite to user";
      return response;
    }
    response.success = true;
    response.data = result;
    return response;
  } catch (error: Error | any) {
    logger.error(`Error occurred in linkInviteToUserService for ${inviteType}: `, error);
    response.error = error.message || error;
    return response;
  }
};



export const getShareHolderInviteById = async (inviteId: number) => {
  try {
     const invitedShareHolder = await getInvitedShareHolderId(inviteId)
     return invitedShareHolder
  }
  catch (error){
    logger.error("Error ")
  }
}


export const getDirectorInviteById = async (inviteId: number) => {
  try {
    const invitedDirector = await getDirectorFromInviteTable(inviteId);
    return invitedDirector;
  } catch (error) {
    logger.error("Error in getDirectorInviteById: ", error);
    throw new Error("Error fetching director invite details");
  }
};

