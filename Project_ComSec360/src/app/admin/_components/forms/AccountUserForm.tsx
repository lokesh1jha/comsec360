"use client";
import CustomFormField from "@/components/CustomFormFields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { Users_Table } from "@/db/schema";
import { UpdateAccountUser } from "@/lib/actions";
import { createNewAccountUser, updateAccountUser } from "@/lib/api/user/users";
import { AccountUserSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { InferSelectModel } from "drizzle-orm";
import { Loader, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

export function AccountUserForm({
  user,
}: {
  user?: InferSelectModel<typeof Users_Table>;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof AccountUserSchema>>({
    resolver: zodResolver(AccountUserSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      password: user?.password ?? "",
      confirmPassword: user?.password ?? "",
    },
  });

  const { isSubmitting } = form.formState;
  const onSubmit = async (values: z.infer<typeof AccountUserSchema>) => {
    const result = user
      ? await updateAccountUser(values, user.id)
      : await createNewAccountUser(values);

    if (result?.success)
      toast.success(
        `Account User ${user ? "Updated" : "Created"} Successfully!!`,
      );
    else toast.error("Sorry!! Something went Wrong.");

    router.refresh();
  };


  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
          <CustomFormField
            name="firstName"
            control={form.control}
            label="First Name"
            placeholder="Eg: James"
          />
          <CustomFormField
            name="lastName"
            control={form.control}
            label="Last Name"
            placeholder="Eg: Bond"
          />
        </div>
        <CustomFormField
          type="email"
          name="email"
          control={form.control}
          label="E-mail"
          placeholder="example@email.com"
        />
        <CustomFormField
          name="password"
          control={form.control}
          label="Password"
          placeholder="XXXXXXXX"
        />
        <CustomFormField
          type="password"
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="XXXXXXXX"
        />
        <Button
          type="submit"
          variant="gooeyLeft"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader className="mr-2 size-5 animate-spin" />
          ) : (
            <User2 className="mr-2 size-5 my-auto" />
          )}
          &nbsp;
          {isSubmitting
            ? user
              ? "Saving"
              : "Creating"
            : user
              ? "Save"
              : "Create"}
          &nbsp; Account User
        </Button>
      </form>
    </Form>
  );
}
