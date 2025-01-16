"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { verifyGuestUser } from "@/api/shareholder";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function Popup({ onVerified }: { onVerified: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const storedId = localStorage.getItem("id");
      const storedEmail = localStorage.getItem("email");
      const storedInviteType = localStorage.getItem("inviteType");
      if(!storedId || !storedEmail || !storedInviteType){
        toast({
          title: "Error",
          description: "Verification failed. Please click on the link sent to your email.",
          variant: "destructive",
        })
        return;
      }
      // Simulate API call
      const response = await verifyGuestUser(parseInt(storedId), data.pin, storedEmail, storedInviteType);
      console.log(response);
      if (response.token) {
        toast({
          title: "Success!",
          description: "You have verified successfully.",
        });
        localStorage.setItem("token", response.token);
        setOpen(false);
        onVerified(); // Callback to inform the parent that verification is successful
      } else {
        throw new Error(response.message || "Verification failed.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Verification failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome!</AlertDialogTitle>
          <AlertDialogDescription>
            To continue, please verify yourself using OTP.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
