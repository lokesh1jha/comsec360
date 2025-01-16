import { z } from "zod";
// use of react-phone-number-input throws error: TypeError: Super expression must either be null or a function
// import { isValidPhoneNumber } from "react-phone-number-input";

export const AuthFormSchema = z.object({
  email: z
    .string({ required_error: "*required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "*required" }).trim()
    .min(8, "password length must be atleast 8 characters")
    .max(50, "password length should not be grater than 50 characters")
});

// For Admin Purpose
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

//For Account User Purpose

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

export const CompanyInfoFormSchema = z
  .object({
    name: z.string().trim().min(2, "min. 2 characters").max(255),
    chiname: z.string().trim().max(255).optional(),
    type: z.enum(["public", "private"]),
    code: z.string().length(3, { message: "*required" }),
    nature: z.string().min(5, { message: "*required" }),
    house: z.string().trim().max(65).optional(),
    building: z.string().trim().max(65).optional(),
    street: z.string().trim().max(65).optional(),
    district: z.string().trim().max(65).optional(),
    country: z
      .string()
      .trim()
      .min(3, "*required | need min. 3 characters")
      .max(20),
    email: z.string().max(255).trim().optional(),
    companyTel: z
      .string()
      .trim()
      // .refine(isValidPhoneNumber, { message: "Invalid phone number" })
      .or(z.literal("")),
    companyFax: z
      .string()
      .trim(),
      // .refine(isValidPhoneNumber, { message: "Invalid phone number" }).or(z.literal("")),
    time: z.enum(["1 year", "3 years"]),
    companyLogo: z.any(),
    presentorName: z.string().trim().min(2, "min. 2 characters").max(255),
    presentorChiName: z.string().trim().max(255).optional(),
    presentorAddress: z
      .string()
      .trim()
      .min(10, "need min. 10 characters")
      .max(65535),
    presentorTel: z
      .string()
      // .refine(isValidPhoneNumber, { message: "Invalid phone number" })
      .or(z.literal("")),
    presentorFax: z
      .string()
      // .refine(isValidPhoneNumber, { message: "Invalid phone number" })
      .or(z.literal("")),
    presentorEmail: z.string().max(255).trim().optional(),
    presentorReferance: z.string().max(255).trim(),
  })
  .refine(
    (data) =>
      data.house !== "" ||
      data.building !== "" ||
      data.street !== "" ||
      data.district !== "",
    {
      message: "Fill At Least One Field.",
      path: ["district"],
    },
  );

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
});

export const ShareholdersFormSchema = z.object({
  type: z.enum(["person", "company"]),
  surname: z.string().min(2, "min. 2 char(s)").max(255).trim().nullable(),
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
    .refine((file: string | any[]) => file?.length === 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      "Max file size is 3MB."
    ),
  addressProof: z
    .any()
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      "Max file size is 3MB."
    ),
});

export const DirectorsFormSchema = z.object({
  type: z.enum(["person", "company"], { required_error: "*required" }),
  surname: z.string().min(2, "min. 2 char(s)").max(255).nullable(),
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    .refine((file: string | any[]) => file?.length === 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      "Max file size is 3MB.",
    ),
  addressProof: z
    .any()
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      "Max file size is 3MB.",
    ),
});

export const CompanySecretaryFormSchema = z.object({
  tcspLicenseNo: z.string().max(100).trim(),
  tcspReason: z
    .string()
    .min(10, "need min. 10 characters")
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
  idProof: z
    .any()
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    .refine((file: string | any[]) => file?.length === 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      "Max file size is 3MB.",
    ),
  addressProof: z.any(),
});
