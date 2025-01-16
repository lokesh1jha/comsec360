import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";



// CompanyInfo

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
  companyLogo: z
    .any()
});

// Share-Capital

export const ShareCapitalFormSchema = z.object({
  id: z.coerce.number().optional(),
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
});

// Sharholders

const shareDetailsSchema = z.object({
  classOfShares: z.string().max(255),
  noOfShares: z.coerce
    .number()
    .nonnegative({ message: "This field can't be negative" })
    .min(1),
});

export const GuestUserFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  email: z.string().max(255).email().trim(),
  shareDetails: z.array(shareDetailsSchema).default([]).optional(),
});

export const ShareholdersFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).trim().nullable().optional(),
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
  idProof: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  addressProof: z
    .any().optional().nullable(),
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

export const DirectorsFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).nullable(),
  name: z.string().min(2, "min. 2 char(s)").max(255),
  idNo: z.string().max(100),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535),
  phone: z.string(),
  email: z.string().max(255).email().optional(),
  idProof: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  addressProof: z
    .any(),
});

export const DirectorsUpdateFormSchema = z.object({
  name: z.string().min(2, "min. 2 char(s)").max(255),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535),
  phone: z.string(),
  email: z.string().max(255).email().optional(),
});

//Company Secretary Schema
export const CompanySecretaryFormSchema = z.object({
  tcspLicenseNo: z.string().max(100).trim(),
  tcspReason: z
    .string()
    .max(65535)
    .trim()
    .optional(),
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().max(255).trim().optional().nullable(),
  name: z.string().min(2, "min. 2 char(s)").max(255).trim(),
  idNo: z.string().max(100),
  address: z
    .string({ required_error: "*required" })
    .min(10, "*required | need min. 10 characters")
    .max(65535)
    .trim(),
  phone: z.string(),
  email: z.string().max(255).email().trim(),
  idProof: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  addressProof: z.any().optional().nullable(),
});
