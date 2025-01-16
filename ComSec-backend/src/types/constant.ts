export const UserTypeObject: { [key: string]: string } = {
  admin: "admin",
  account_user: "account_user",
  guest: "guest",
};


export type AccountUser = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  type: string;
  email: string;
  createdAt: Date;
};


export type ShareHolderInvite = {
  id: number;
  email: string;
  otp: string;
  linkExpiry: Date;
  invitedByUserId: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
};