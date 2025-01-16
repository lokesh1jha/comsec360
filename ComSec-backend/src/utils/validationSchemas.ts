import { z } from "zod";

export const AccountUserSchema = z
  .object({
    firstName: z
      .string({ required_error: "Please enter your First Name!" }).trim()
      .min(1, "First Name is required!")
      .max(50),
    lastName: z
      .string({ required_error: "Please enter your Second Name!" }).trim()
      .min(1, "Last Name is required!")
      .max(50),
    email: z
      .string({ required_error: "Please enter your Email!" })
      .email({ message: "Invalid E-mail" }),
    password: z
      .string({ required_error: "Please enter your password!" })
      .min(8, "Min. 8 Characters")
      .max(255),
    confirmPassword: z.string().min(8, "Min. 8 characters").max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const AuthFormSchema = z.object({
  email: z
    .string({ required_error: "*required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "*required" }).trim()
    .min(8, "password length must be atleast 8 characters")
    .max(50, "password length should not be grater than 50 characters")
});



export const CompanyInfoFormSchema = z.object({
  name: z.string().min(2, "min. 2 characters").max(255).trim(),
  chiname: z.string().max(255).trim().optional(),
  type: z.enum(["public", "private"]),
  code: z.string().length(3, { message: "*required" }),
  nature: z.string().min(5, { message: "*required" }).trim(),
  house: z.string().max(65).trim().optional(),
  building: z.string().max(65).trim().optional(),
  street: z.string().max(65).trim().optional(),
  district: z.string().max(65).trim().optional(),
  country: z
    .string()
    .min(3, "*required | need min. 3 characters")
    .max(20)
    .trim(),
  email: z.string().max(255).trim().optional(),
  companyTel: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),
  companyfax: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),
  time: z.enum(["1 year", "3 years"]),
  presentorName: z.string().min(2, "min. 2 characters").max(255).trim(),
  presentorChiName: z.string().max(255).trim().optional(),
  presentorAddress: z
    .string()
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  presentorTel: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),
  presentorFax: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .or(z.literal("")),
  presentorEmail: z.string().max(255).trim().optional(),
  presentorReferance: z.string().max(255).trim(),
  companyLogo: z.string().max(255).trim().optional(),
});


function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^[+]?(\d{1,3})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
  return phoneRegex.test(phoneNumber);
}



export const ShareCapitalFormSchema = z.object({
  class: z.string().max(255).trim(),
  totalProposed: z.coerce.number().positive().min(1, { message: "min. 1" }),
  currency: z.string().max(3),
  unitPrice: z.coerce.number().positive().min(1, {
    message: "min. 1",
  }),
  total: z.coerce
    .number()
    .nonnegative({ message: "This field can't be negative" })
    .min(0.01),
  paid: z.coerce
    .number()
    .nonnegative({ message: "This field can't be negative" })
    .min(0),
  unpaid: z.coerce
    .number()
    .nonnegative({ message: "This field can't be negative" }),
  rightsAttached: z
    .string()
    .min(1, { message: "*required" })
    .max(255)
    .trim()
    .optional(),
  companyId: z.number().optional(),
});

const shareDetailsSchema = z.object({
  classOfShares: z.string().max(255),
  noOfShares: z.coerce
    .number()
    .nonnegative({ message: "This field can't be negative" })
    .min(1),
});


export const ShareholdersFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).trim().nullable(),
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  idNo: z.string().max(100).trim(),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  phone: z.string(),
  email: z.string().max(255).email().trim().optional(),
  shareDetails: z.array(shareDetailsSchema).default([]),
  idProof: z.string(),
  addressProof: z.any().optional().nullable(),
});


export const InvitedShareholdersFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).trim().nullable(),
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  idNo: z.string().max(100).trim(),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  phone: z.string(),
  email: z.string().max(255).email().trim().optional(),
  shareDetails: z.array(shareDetailsSchema).default([]),
  idProof: z.string(),
  addressProof: z.any().optional(),
  shareHolderInviteId: z.number(),
  companyId: z.number()
});

export const ShareholdersUpdateFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  phone: z.string(),
  email: z.string().max(255).email().trim().optional(),
  shareDetails: z.array(shareDetailsSchema).default([]),
});

export const InvitedDirectorFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).trim().nullable(),
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  idNo: z.string().max(100).trim(),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  phone: z.string(),
  email: z.string().max(255).email().trim().optional(),
  idProof: z.string(),
  addressProof: z.any().optional(),
  directorInviteId: z.number(),
  companyId: z.number()
});


export const InviteFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  email: z.string().max(255).email().trim(),
  shareDetails: z.array(shareDetailsSchema).default([]).optional(),
})


export const DirectorInviteFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  email: z.string().max(255).email().trim(),
})

export const DirectorsUpdateFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535),
  phone: z.string(),
  email: z.string().max(255).email().optional(),
});

export const GuestUserFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  email: z.string().max(255).email().trim(),
  shareDetails: z.array(shareDetailsSchema).default([]).optional(),
});



export const DirectorsFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).nullable().optional(),
  name: z.string().min(2, "min. 2 char(s)").max(255),
  idNo: z.string().max(100),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535),
  phone: z.string(),
  email: z.string().max(255).email().optional(),
  idProof: z.string(),
  addressProof: z.any().optional().nullable(),
});


export const CompanySecretaryFormSchema = z.object({
  tcspLicenseNo: z.string().max(100).trim(),
  tcspReason: z
    .string()
    .max(65535)
    .trim()
    .optional(),
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).trim().optional(),
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  idNo: z.string().max(100),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  phone: z.string(),
  email: z.string().max(255).email().trim(),
  idProof: z.string(),
  addressProof: z.any().optional(),
});


export const GuestUserGetSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  email: z.string().max(255).email().trim(),
  companyId: z.number(),
});


export const GuestOTPSchema = z.object({
  id: z.number(),
  otp: z.string().length(6, { message: "*required" }),
  email: z.string().max(255).email().trim(),
  inviteType: z.enum(["shareholder", "director"]),
});


export const GetCompaniesSchema = z.object({
  incorporationStartDate: z.string().optional(),
  incorporationEndDate: z.string().optional(),
  annualReturnStartDate: z.string().optional(),
  annualReturnEndDate: z.string().optional(),
  financialStartDate: z.string().optional(),
  financialEndDate: z.string().optional(),
  page: z.string().transform((val) => parseInt(val)).optional(),
  pageSize: z.string().transform((val) => parseInt(val)).optional(),
});
