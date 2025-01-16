"use client";
import { uploadCompanyLogo } from "@/api/company";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FileSchema = z.object({
  name: z.string(),
  type: z.enum(["pdf", "jpg"]),
  size: z.number(),
});

const FileInputSchema = z.object({
  SignedNNC1: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
});

export function UploadPopup({ type, user }: { type: string, user: { position: string, id: number } }) {
  const [id, setId] = useState<number>(user.id);
  const [position, setPosition] = useState<string>(user.position);
  console.log(`User ID: ${user.id}, Position: ${user.position}`);

  const form = useForm<z.infer<typeof FileInputSchema>>({
    resolver: zodResolver(FileInputSchema),
    defaultValues: {
      SignedNNC1: undefined,
    },
  });

  const SignedNNC1Ref = form.register("SignedNNC1", { required: true });

  const handleFileUpload = async (file: File) => {
    try {
      console.log("-------------", user.id.toString(), user);
      const data = await uploadCompanyLogo(file, id.toString(), position.split(" ")[0]);
      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function onSubmit(values: z.infer<typeof FileInputSchema>) {
    console.log(values);
    if (values.SignedNNC1 && values.SignedNNC1.length > 0) {
      handleFileUpload(values.SignedNNC1[0]);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Signed NNC1</DialogTitle>
          <DialogDescription>
            Upload NNC1 form after signing. Click Submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="SignedNNC1"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signed NNC1 Proof</FormLabel>
                  <FormControl>
                    <Input
                      type="File"
                      placeholder="Upload a Copy"
                      {...SignedNNC1Ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
