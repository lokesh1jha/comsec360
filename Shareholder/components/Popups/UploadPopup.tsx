"use client";
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
import { useForm } from "react-hook-form";
import { z } from "zod";

const FileSchema = z.object({
  name: z.string(),
  type: z.enum(["pdf", "jpg"]),
  size: z.number(),
});

const FileInputSchema = z.object({
  AddressProof: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  IDProof: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
  SignedNNC1: z
    .any()
    .refine((file: string | any[]) => file?.length == 1, "File is required.")
    .refine(
      (file: { size: number }[]) => file[0]?.size <= 3000000,
      `Max file size is 3MB.`
    ),
});

export function UploadPopup({ type }: { type: string }) {
  const form = useForm<z.infer<typeof FileInputSchema>>({
    resolver: zodResolver(FileInputSchema),
    defaultValues: {
      AddressProof: undefined,
      IDProof: undefined,
      SignedNNC1: undefined,
    },
  });

  const AddressFileRef = form.register("AddressProof", { required: false });
  const IDFileRef = form.register("IDProof", { required: true });
  const SignedNNC1Ref = form.register("SignedNNC1", { required: true });

  function onSubmit(values: z.infer<typeof FileInputSchema>) {
    console.log(values);
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
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload documents after signing. Click Submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "Person" && (
              <FormField
                name="AddressProof"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Proof</FormLabel>
                    <FormControl>
                      <Input
                        type="File"
                        placeholder="Upload a Copy"
                        {...AddressFileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="IDProof"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Proof</FormLabel>
                  <FormControl>
                    <Input
                      type="File"
                      placeholder="Upload a Copy"
                      {...IDFileRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
