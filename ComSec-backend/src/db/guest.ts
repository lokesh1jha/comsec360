import prisma from "../config/prisma";

export const addNewShareholderFromInvite = async (
  inviteId: number,
  shareholderDetails: {
    type: "PERSON" | "COMPANY";
    idNo: string;
    idProof: string;
    name: string;
    surname: string;
    address: string;
    addressProof: string;
    email: string;
    phone: string;
    sharesDetails: object;
    companyId: number;
  }
) => {
  try {
    // Start a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx: any) => {
      // Insert the new shareholder
      const newShareholder = await tx.shareholder.create({
        data: {
          type: shareholderDetails.type,
          idNo: shareholderDetails.idNo,
          idProof: shareholderDetails.idProof,
          name: shareholderDetails.name,
          surname: shareholderDetails.surname,
          address: shareholderDetails.address,
          addressProof: shareholderDetails.addressProof,
          email: shareholderDetails.email,
          phone: shareholderDetails.phone,
          sharesDetails: shareholderDetails.sharesDetails,
          companyId: shareholderDetails.companyId,
        },
      });

      // Update the invite with the new shareholder's ID
      await tx.shareholderInvite.update({
        where: {
          id: inviteId,
        },
        data: {
          shareholderId: newShareholder.id,
          isAccepted: true,
        },
      });

      return newShareholder;
    });

    console.log("New shareholder created and invite updated:", result);
    return result;
  } catch (error) {
    console.error("Error adding new shareholder:", error);
    return null
  }
}


export const getInvitedShareHolderById = async (id: number, email: string, otp: string) => {
  return await prisma.shareholderInvite.findFirst({
    where: {
      id: id,
      email: email,
      otp: otp
    }
  })
}

export const getDirectorFromInviteTable = async (id: number) => {
  return await prisma.directorInvite.findFirst({
    where: { id }
  })
}
export const linkShareholderInviteAndUserId = async (inviteId: number, userId: any) => {
  return await prisma.shareholderInvite.update({
    where: { id: inviteId },
    data: {
      userId: userId
    },
  });
}


export const linkDirectorInviteToUser = async (inviteId: number, userId: any) => {
  return await prisma.directorInvite.update({
    where: { id: inviteId },
    data: {
      userId: userId
    },
  });
}

export const updateShareholderInviteExpiry = async (id: number, newExpiryTimestamp: number) => {
  return await prisma.shareholderInvite.update({
    where: { id },
    data: {
      linkExpiry: new Date(newExpiryTimestamp), // Convert timestamp to Date object
    },
  });
};

export const updateDirectorInviteExpiry = async (id: number, newExpiryTimestamp: number) => {
  return await prisma.directorInvite.update({
    where: { id },
    data: {
      linkExpiry: new Date(newExpiryTimestamp), // Convert timestamp to Date object
    },
  });
};

export const updateShareholderInvite = async (invite: any) => {
  return await prisma.shareholderInvite.update({
    where: { id: invite.id },
    data: {
      isAccepted: true,
    },
  });
};



export const getInvitedShareHolderId = async (inviteId: number) => {
  return prisma.shareholderInvite.findFirst({
    where: { id: inviteId }
  })
}

// Insert a new shareholder and link the invite row
export const insertShareHolder = async (data: {
  shareholder: {
    type: "PERSON" | "COMPANY";
    idNo: string;
    idProof: string;
    name: string;
    surname: string;
    address: string;
    addressProof: string;
    email: string;
    phone: string;
    sharesDetails: any;
    companyId: number;
  };
  inviteId: number;
}): Promise<any> => {
  const { shareholder, inviteId } = data;

  // Step 1: Insert the new shareholder
  const newShareholder = await prisma.shareholder.create({
    data: shareholder,
  });

  // Step 2: Update the invite row to link the new shareholder and mark as accepted
  await prisma.shareholderInvite.update({
    where: { id: inviteId },
    data: {
      shareholderId: newShareholder.id,
      isAccepted: true,
    },
  });

  return newShareholder;
};

// Update an existing shareholder
export const updateShareHolder = async (
  inviteId: number,
  data: {
    type: "PERSON" | "COMPANY";
    idNo: string;
    idProof: string;
    name: string;
    surname?: string;
    address: string;
    addressProof?: string;
    phone: string;
  }
): Promise<any> => {
  // Get the shareholder ID from the invite table
  const invite = await prisma.shareholderInvite.findUnique({
    where: { id: inviteId },
    select: { shareholderId: true },
  });

  if (!invite || !invite.shareholderId) {
    throw new Error("Invite not found or shareholder ID is missing");
  }

  // Update the shareholder using the retrieved shareholder ID
  return await prisma.shareholder.update({
    where: { id: invite.shareholderId },
    data,
  });
};


// Insert a new director and link the invite row
export const insertDirector = async (data: {
  director: {
    type: "PERSON" | "COMPANY";
    idNo: string;
    idProof: string;
    name: string;
    surname: string;
    address: string;
    addressProof: string;
    email: string;
    phone: string;
    companyId: number;
  };
  inviteId: number;
}): Promise<any> => {
  const { director, inviteId } = data;

  // Step 1: Insert the new director
  const newDirector = await prisma.director.create({
    data: director,
  });

  // Step 2: Update the invite row to link the new director and mark as accepted
  await prisma.directorInvite.update({
    where: { id: inviteId },
    data: {
      directorId: newDirector.id,
      isAccepted: true,
    },
  });

  return newDirector;
};

// Update an existing director
export const updateDirector = async (
  inviteId: number,
  data: {
    type: "PERSON" | "COMPANY";
    idNo: string;
    idProof: string;
    name: string;
    surname?: string;
    address: string;
    addressProof?: string;
    phone: string;
  }
): Promise<any> => {
  // Get the director ID from the invite table
  const invite = await prisma.directorInvite.findUnique({
    where: { id: inviteId },
    select: { directorId: true },
  });

  if (!invite || !invite.directorId) {
    throw new Error("Invite not found or director ID is missing");
  }

  // Update the director using the retrieved director ID
  return await prisma.director.update({
    where: { id: invite.directorId },
    data,
  });
};