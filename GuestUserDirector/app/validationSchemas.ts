import { z } from "zod";


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
    .any().nullable(),
});
