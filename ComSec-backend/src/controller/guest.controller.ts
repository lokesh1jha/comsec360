import { Request, Response } from "express";
import logger from "../utils/logger";
import { getCompanyDetailsService, getDirectorsService, getShareCapitalService, getShareHoldersService } from "../services/account-user.service";
import { getDirectorInviteById, getShareHolderInviteById, verifyInviteService } from "../services/guest.service";
import { insertDirector, insertShareHolder, updateDirector, updateShareHolder } from "../db/guest";

export const verifyInvite = async (req: Request, res: Response) => {
  try {
    const { id, email, otp, inviteType } = req.body;

    // Validate request data
    if (!id || !email || !otp || !inviteType) {
      res.status(400).json({ error: "Invalid request parameters." });
      return;
    }

    const inviteId = parseInt(id, 10);

    // Call service function to verify the invite
    const token = await verifyInviteService(inviteId, email, otp, inviteType);

    res.status(200).json({
      token,
      message: "Logged in successfully.",
    });
  } catch (error) {
    logger.error("Error in verifyInvite:", error);
    res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export const addGuestShareholder = async (req: Request, res: Response) => {
  try {
    const { id, email, otp, inviteType } = req.body;
    const token = await verifyInviteService(id, email, otp, inviteType);
    logger.info("addGueetShareholder controller: ", token);

    res.status(200).json({
      success: true,
      message: "Shareholder added successfully",
      token: token
    });
  } catch (error) {
    logger.error("Error occured in addGueetShareholder controller: ", error);
    res.status(500).json({ sucess: false, error: error });
  }
}

export const getGuestShareholderContent = async (req: Request, res: Response) => {
  try {
    const company_id = parseInt(req.params.company_id)
      
    res.status(200).json({
      shareCapital: (await getShareCapitalService(company_id)).data,
      shareHolders: (await getShareHoldersService(company_id)).data,
      companyInfo: (await getCompanyDetailsService(company_id)).data
    });
    return
  } catch (error) {
    logger.error("Error occured in getShareHolderContent controller: ", error);
    res.status(500).json({ sucess: false, error: error });
  }
}

export const addShareHolderByGuest = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.company_id ? parseInt(req.params.company_id) : null
    if (!companyId) {
      res.status(400).json({ message: "company_id missing from params", error: "company_id missing from params" })
      return
    }
    const { shareHolderInviteId } = req.body;
    const data = req.body;
    delete data.shareHolderInviteId

    // check if invite row has shareholer_id if yes then  update else m,ake new and sve
    const shareHolderInvite = await getShareHolderInviteById(shareHolderInviteId)
    if (!shareHolderInvite) {
      res.status(400).json({ message: "Invited Share holder not found", data: [] })
      return
    }
    data.type = data.type.toUpperCase()
    data.sharesDetails = data.shareDetails
    delete data.shareDetails
    delete data.loggedInUser

    let shareHolderResponse: any;
    if (shareHolderInvite.shareholderId) {
      shareHolderResponse = await updateShareHolder(shareHolderInviteId, data)
    } else {
      shareHolderResponse = await insertShareHolder({ shareholder: data, inviteId: shareHolderInviteId })
    }

    if (!shareHolderResponse) {
      res.status(400).json({ message: "Failed to Update the Share Holder Details" })
      return
    }

    res.status(200).json({ message: "Succecssfully Inserted the Share Holder Details", data: shareHolderResponse })
    return;
  } catch (error) {
    logger.error("Error in addShareHolderByGuest:", error);
    res.status(500).json({ error: "Internal server error." });
    return
  }
}

export const getShareHolderInvite = async (req: Request, res: Response) => {
  try {
    const { inviteId } = req.params;
    const invite = await getShareHolderInviteById(parseInt(inviteId, 10));

    if (!invite) {
      res.status(404).json({ message: "Invite not found" });
      return;
    }

    res.status(200).json({ data: invite });
  } catch (error) {
    logger.error("Error in getShareHolderInvite:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const addDirectorByGuest = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.company_id ? parseInt(req.params.company_id) : null;
    if (!companyId) {
      res.status(400).json({ message: "company_id missing from params", error: "company_id missing from params" });
      return;
    }
    const { directorInviteId } = req.body;
    const data = req.body;
    delete data.directorInviteId;

    const directorInvite = await getDirectorInviteById(directorInviteId);
    if (!directorInvite) {
      res.status(400).json({ message: "Invited Director not found", data: [] });
      return;
    }
    data.type = data.type.toUpperCase();
    delete data.loggedInUser;

    let directorResponse: any;
    if (directorInvite.directorId) {
      directorResponse = await updateDirector(directorInviteId, data);
    } else {
      directorResponse = await insertDirector({ director: data, inviteId: directorInviteId });
    }

    if (!directorResponse) {
      res.status(400).json({ message: "Failed to Update the Director Details" });
      return;
    }

    res.status(200).json({ message: "Successfully Inserted the Director Details", data: directorResponse });
    return;
  } catch (error) {
    logger.error("Error in addDirectorByGuest:", error);
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};

export const getDirectorInvite = async (req: Request, res: Response) => {
  try {
    const { inviteId } = req.params;
    const invite = await getDirectorInviteById(parseInt(inviteId, 10));

    if (!invite) {
      res.status(404).json({ message: "Invite not found" });
      return;
    }
    const companyInfo = await getCompanyDetailsService(invite.companyId);

    res.status(200).json({ data: invite, companyInfo: companyInfo.data });
  } catch (error) {
    logger.error("Error in getDirectorInvite:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const getGuestDirectorContent = async (req: Request, res: Response) => {
  try {
    const company_id = parseInt(req.params.company_id);

    res.status(200).json({
      data: (await getDirectorsService(company_id)).data,
    });
    return;
  } catch (error) {
    logger.error("Error occurred in getGuestDirectorContent controller:", error);
    res.status(500).json({ success: false, error: error });
  }
};