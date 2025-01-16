"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthFormSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import { useAuthContext } from "./AuthProvider";
import { getCompanyCount } from "@/lib/api/user/users";


const AuthForm = () => {
  const { login } = useAuthContext();
  const router = useRouter();
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof AuthFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    async function userLogin() {
      try {
        const response = await login(values.email, values.password);

        if (!response.success) {
          toast.error(response.error);
          return;
        }

        const { token, user } = response.data;
        if (token) {
          toast.success("Logged in Successfully!!");

          switch (user?.type) {
            case "admin":
              localStorage.setItem("token", token);
              localStorage.setItem("type", "admin");
              router.push("/admin");
              break;
            case "account_user":
              const userEncoded = encodeURIComponent(JSON.stringify(user));
              const accountUserUrl = process.env.NEXT_PUBLIC_CS_ACCOUNT_USER_URL ?? 'http://52.59.5.100:3000';
              const multiUserUrl = process.env.NEXT_PUBLIC_CS_MULTI_USER_URL ?? 'http://3.74.161.52:3000';

              console.log("user --------", token);
              const getCompanyCountResponse = await getCompanyCount();

              if (!getCompanyCountResponse.success) {
                toast.error("An error occurred during login");
                return;
              }
              const getCompanyCountByUserId = getCompanyCountResponse.count;
              // console.log("getCompanyCountByUserId", getCompanyCountByUserId);
              if (getCompanyCountByUserId === 0) {
                window.location.href = `${accountUserUrl}?token=${token}&type=account_user&user=${userEncoded}`;
              }
              else {
                // send to multiUser list
                window.location.href = `${multiUserUrl}?token=${token}&type=account_user&user=${userEncoded}`;
              }
              break;
            case "guest":
              // router.push("/guest");
              break;
            default:
              toast.error("Unknown user type");
          }
        }
      } catch (error) {
        toast.error("An error occurred during login");
      }
    }
    userLogin()
      .then(() => {
        console.log("success");
      });

  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gooeyLeft" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
