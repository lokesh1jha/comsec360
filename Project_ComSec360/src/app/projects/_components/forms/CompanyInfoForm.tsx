"use client";

import { CompanyInfoFormSchema } from "@/lib/validationSchemas";
import {
  CompanyAddressHoverCard,
  CompanyNameHoverCard,
  CompanyPresentorHoverCard,
  CompanyTimeHoverCard,
  CompanyTypeHoverCard,
} from "@/components/hovercards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import type { z } from "zod";
import CustomFormField, {
  CustomCheckboxField,
  CustomNatureOfBusinessField,
  PresentorsReferenceField,
} from "@/components/CustomFormFields";

const CompanyInfoForm = () => {
  const form = useForm<z.infer<typeof CompanyInfoFormSchema>>({
    resolver: zodResolver(CompanyInfoFormSchema),
    defaultValues: {
      name: "",
      chiname: "",
      code: "",
      nature: "",
      type: "private",
      house: "",
      building: "",
      street: "",
      district: "",
      country: "Hong Kong",
      email: "",
      companyTel: "",
      companyFax: "",
      time: "1 year",
      presentorName: "",
      presentorChiName: "",
      presentorAddress: "",
      presentorTel: "",
      presentorFax: "",
      presentorEmail: "",
      presentorReferance: "CompanyName-NNC1-06-03-2024",
      companyLogo: undefined,
    },
  });
  const LogoFileRef = form.register("companyLogo", { required: true });

  // Submit Handler.
  function onSubmit(values: z.infer<typeof CompanyInfoFormSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Info</CardTitle>
        <CardDescription>Enter information about your Company</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <CustomFormField
                type="text"
                name="name"
                control={form.control}
                label="Company Name (English):"
                placeholder="Company Name (English):"
                hoverCard={<CompanyNameHoverCard />}
              />
              <CustomFormField
                type="text"
                name="chiname"
                control={form.control}
                label="Company Name (Chinese):"
                placeholder="Company Name (Chinese):"
              />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <CustomCheckboxField
                name="type"
                control={form.control}
                label="Select Type of Company:"
                hoverCard={<CompanyTypeHoverCard />}
                value1="private"
                value2="public"
              />
              <div className="flex gap-2 items-center">
                <CustomFormField
                  type="number"
                  name="code"
                  control={form.control}
                  label="Code:"
                  placeholder="XXX"
                  readOnly={true}
                />
                <CustomNatureOfBusinessField form={form} />
              </div>
            </div>
            <div className="space-y-3">
              <CustomFormField
                type="text"
                name="house"
                control={form.control}
                placeholder="Flat / Floor / Block"
                label="Address:"
                hoverCard={<CompanyAddressHoverCard />}
              />
              <CustomFormField
                type="text"
                name="building"
                control={form.control}
                placeholder="Building"
              />
              <CustomFormField
                type="text"
                name="street"
                control={form.control}
                placeholder="Street"
              />
              <CustomFormField
                type="text"
                name="district"
                control={form.control}
                placeholder="District"
              />
              <CustomFormField
                type="text"
                name="country"
                control={form.control}
                placeholder="HongKong"
                readOnly
              />
            </div>
            <CustomFormField
              type="email"
              label="Company E-mail:"
              name="email"
              control={form.control}
              placeholder="company@email.com"
            />
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <CustomFormField
                name="companyTel"
                control={form.control}
                label="Company Telephone:"
                placeholder="Enter a phone number"
              />
              <CustomFormField
                name="companyFax"
                control={form.control}
                label="Company Fax:"
                placeholder="Enter a phone number"
              />
            </div>
            <CustomCheckboxField
              name="time"
              control={form.control}
              label=" Choose how long period of Business Registration Fee:"
              value1="1 year"
              value2="3 years"
              hoverCard={<CompanyTimeHoverCard />}
            />
            <FormField
              name="companyLogo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo:</FormLabel>
                  <FormControl>
                    <Input
                      type="File"
                      placeholder="Upload a Copy"
                      {...LogoFileRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2">
                  <span>Presentor&lsquo;s Referance</span>
                  <CompanyPresentorHoverCard />
                </CardTitle>
                <CardDescription>
                  Please enter info on Presentor&lsquo;s Referance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-3">
                  <CustomFormField
                    name="presentorName"
                    control={form.control}
                    label="Name (English):"
                    placeholder="James Bond"
                  />
                  <CustomFormField
                    name="presentorChiname"
                    control={form.control}
                    label="Name (Chinese):"
                    placeholder="Name (Chinese)"
                  />
                </div>
                <CustomFormField
                  name="presentorAddress"
                  control={form.control}
                  label="Address:"
                  placeholder="Eg: 16, Taichi Street..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <CustomFormField
                    name="presentorTel"
                    control={form.control}
                    label="Fax No:"
                    placeholder="Enter a phone number"
                  />
                  <CustomFormField
                    name="presentorFax"
                    control={form.control}
                    label="Fax No:"
                    placeholder="Enter a phone number"
                  />
                </div>
                <CustomFormField
                  type="email"
                  name="presentorEmail"
                  control={form.control}
                  label="E-mail:"
                  placeholder="info@presentor.com"
                />
                <PresentorsReferenceField form={form} />
              </CardContent>
            </Card>
            <div className="flex justify-end items-center">
              <Button type="submit" variant="destructive">
                Save & Next
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoForm;
