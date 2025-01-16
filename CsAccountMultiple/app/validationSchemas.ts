import { z } from "zod";

// CompanyInfo
const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank Name must be atleast 2 characters").max(50),
  bankAcc: z
    .string()
    .min(12, "It should be 12 numbers exactly")
    .max(12, "It should be 12 numbers"),
});

export const CompanyInfoFormSchema = z.object({
  date: z.string(),
  name: z.string().min(2, "Name must be atleast 2 characters").max(255),
  chiname: z.string().min(2, "Name must be atleast 2 characters").max(255),
  incorporated: z.string().min(10).max(100),
  annual: z.string().min(10).max(100),
  address: z.string().min(1, "Address is required").max(65535),
  bankDetails: z.array(bankAccountSchema).default([]).optional(),
  email: z.string().email(),
  companyTel: z.string().length(12),
  companyfax: z.string().length(12),
});

// Share-Capital
const shareRightSchema = z.object({
  class: z.string().max(255),
  rightsAttached: z.number(),
});

export const ShareParticularRightsSchema = z.object({
  shareParticulars: z.array(shareRightSchema).default([]),
});

const shareSchema = z.object({
  class: z.string().max(255),
  totalIssued: z.number(),
  currency: z.string().max(3),
  totalSubscribed: z.number(),
  paid: z.number(),
  unpaid: z.number(),
});

export const ShareCapitalFormSchema = z.object({
  shareCapital: z.array(shareSchema).default([]),
});

// Sharholders

const shareholders = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters").max(255),
  chiname: z.string().min(2, "Name must be atleast 2 characters").max(255),
  start: z.string().min(10).max(100),
  end: z.string().min(10).max(100),
  classOfShares: z.string().max(255),
  totalNumber: z.number(),
  currency: z.string().max(4),
  totalAmount: z.number(),
  shareCertiNo: z.string().min(1),
});

export const ShareholdersFormSchema = z.object({
  shareholders: z.array(shareholders).default([]),
});

//Director and Secretary Schema

const userSchema = z.object({
  type: z.string().length(2),
  name: z.string().min(2, "Name must be atleast 2 characters").max(255),
  chiname: z.string().min(2, "Name must be atleast 2 characters").max(255),
  start: z.string().min(10).max(100),
  end: z.string().min(10).max(100),
  idNo: z.string().max(100),
  companyNo: z.number().max(10),
});

// Directors

export const DirectorsSchema = z.object({
  directors: z.array(userSchema).default([]),
});

// Comapny Secretary

export const CompanySecretaryFormSchema = z.object({
  companySecretary: z.array(userSchema).default([]),
});

export const ObtainDocumentsFormSchema = z.object({
  incorporate: z.date({
    required_error: "A Incorportate date is required.",
  }),
  certificateOfIncorporate: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  notice: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  noticeNumber: z.string().min(10).max(16),
  reciepts: z.any(),
});

export const ShareCertificateSchema = z.object({
  template: z.enum(["default", "blue", "green", "soft-blue"], {
    required_error: "You need to select a template type.",
  }),
});
