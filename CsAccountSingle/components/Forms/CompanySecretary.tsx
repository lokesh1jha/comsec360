"use client";

import { CompanySecretaryFormSchema } from "@/app/validationSchemas";
import { TooltipComponent } from "@/components/Tooltip";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as RPNInput from "react-phone-number-input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PhoneInput } from "../ui/phone-input";
import { toast } from "../ui/use-toast";
import { uploadFileProof } from "@/lib/api/shareHolder";
import { useDataContext } from "@/context/ContextProvider";
import { addSecretaryData } from "@/lib/api/companySecretary";
import { useCompanySecretaryStore } from "@/store/CompanySecretaryStore";

const CompanySecretary = () => {
  const router = useRouter();
  const [disable, setDisable] = useState(false);
  const [idProof, setIdProof] = useState<string | null>(null);
  const [addressProof, setAddressProof] = useState<string | null>(null);
  const { companyId } = useDataContext();
  const [companySecretaryData, setCompanySecretaryData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const state = useCompanySecretaryStore.getState();
      await state.fetchCompanySecretaryData(companyId);
      const content = state.companySecretaryData;
      setCompanySecretaryData(content); // Update state with fetched data
    };

    fetchData().catch((error) => {
      console.error("Error fetching company secretary data:", error);
      // Handle error (e.g., show toast notification)
    });
  }, [companyId]);

  const form = useForm<z.infer<typeof CompanySecretaryFormSchema>>({
    resolver: zodResolver(CompanySecretaryFormSchema),
    defaultValues: {
      tcspLicenseNo: undefined,
      tcspReason: undefined,
      type: "person",
      surname: "",
      name: "",
      idNo: "",
      address: "",
      email: "",
      phone: "",
      idProof: undefined,
      addressProof: undefined,
    },
  });

  const shareholdersRows = [
    {
      label: "Person/Company",
      for: "type",
    },
    {
      label: "Surname",
      for: "surname",
    },
    {
      label: "Name",
      for: "name",
    },
    {
      label: disable
        ? "Company No. / Upload a Copy"
        : "ID/Passport No. / Upload a Copy",
      for: "idNo",
    },
    {
      label: disable ? "Address" : "Address / Upload a Copy",
      for: "address",
    },
    {
      label: "Email",
      for: "email",
    },
    {
      label: "Phone",
      for: "phone",
    },
  ];

  const handleIdProofUpload = async (file: File) => {
    try {
      const response = await uploadFileProof(file, companyId, "idProof");
      console.log("lcoaltion", response.data.location);
      if (response.data.location) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
          variant: "default",
        })
        setIdProof(response.data.location);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "File upload failed",
        variant: "destructive",
      })
    }
  };


  const handleAddressProofUpload = async (file: File) => {
    try {
      console.log("file");
      const response = await uploadFileProof(file, companyId, "addressProof");
      console.log("lcoaltion", response.data);
      if (response.data.location) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
          variant: "default",
        })
        setAddressProof(response.data.location);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "File upload failed",
        variant: "destructive",
      })
    }
  }


  // Submit Handler.
  async function onSubmit(values: z.infer<typeof CompanySecretaryFormSchema>) {
    console.log("Backend is yet to be initialized");
    if (idProof) {
      values.idProof = idProof;
    } else {
      toast({
        title: "Error",
        description: "Please upload ID proof",
        variant: "destructive",
      })
      return
    }
    if (addressProof) {
      values.addressProof = addressProof;
    }

    const response = await addSecretaryData(values, companyId);
    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      })

      return
    }
    else {
      toast({
        title: "Success!!",
        description: response.message,
        variant: "default",
      })
      router.push("/summary");
    }

  }
  const type = form.getValues("type");
  useEffect(() => {
    if (type === "company") {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [type]);

  useEffect(() => {
    if (companySecretaryData) {
      form.reset({
        tcspLicenseNo: companySecretaryData.tcspLicenseNo || "",
        tcspReason: companySecretaryData.tcspReason || "",
        type: companySecretaryData.type || "person",
        surname: companySecretaryData.surname || "",
        name: companySecretaryData.name || "",
        idNo: companySecretaryData.idNo || "",
        address: companySecretaryData.address || "",
        email: companySecretaryData.email || "",
        phone: companySecretaryData.phone || "",
        idProof: companySecretaryData.idProof || "",
        addressProof: companySecretaryData.addressProof || undefined,
      });
      setIdProof(companySecretaryData.idProof);
      setAddressProof(companySecretaryData.addressProof);
    }
  }, [companySecretaryData, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Secretary</CardTitle>
        <CardDescription>
          Please enter information on Company Secretary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 grid-cols-1 items-center gap-6">
              <FormField
                name="tcspLicenseNo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TCSP license No:</FormLabel>
                    <FormControl>
                      <Input placeholder="TCSP License No..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="tcspReason"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      If you do not have License, Please explain the reason:
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your reason here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {shareholdersRows.slice(0, 4).map((row) => (
                    <TableHead
                      key={row.for}
                      className={cn({
                        hidden: disable && row.label === "Surname",
                      })}
                    >
                      <FormLabel htmlFor={row.for}>{row.label}</FormLabel>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <FormField
                      name="type"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex justify-start items-center gap-10"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="person" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Person
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="company" />
                                </FormControl>
                                <Label className="font-normal">Company</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell
                    className={cn({
                      hidden: disable,
                    })}
                  >
                    <FormField
                      name="surname"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Surname Eg: Bond"
                              {...form.register("surname")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name Eg: James" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="space-y-6">
                    <FormField
                      name="idNo"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={`${disable ? "Company" : "ID"
                                } No. Eg: S313XX31X`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="idProof"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="File"
                              placeholder="Upload a Copy"
                              {...form.register("idProof")}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleIdProofUpload(file);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableHeader>
                <TableRow>
                  {shareholdersRows.slice(4, 9).map((row) => (
                    <TableHead key={row.for}>
                      <FormLabel
                        htmlFor={row.for}
                        className={cn({
                          "inline-flex items-center gap-3":
                            !disable && row.label === "Address",
                        })}
                      >
                        {row.label}
                        {!disable && row.label === "Address" && (
                          <TooltipComponent content="Address proof can be a bank letter or utility letter with the name and the address." />
                        )}
                      </FormLabel>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="space-y-6">
                    <FormField
                      name="address"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Eg: No.1 Jianguomenwai Avenue"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {!disable && (
                      <FormField
                        name="addressProof"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="File"
                                placeholder="Upload a Copy"
                                {...form.register("addressProof")}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleAddressProofUpload(file);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Eg: email1@gmail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PhoneInput
                              placeholder="Enter a phone number"
                              defaultCountry="HK"
                              value={(field.value || "") as "" | RPNInput.Value} // Transform value to match expected type
                              onChange={(value) => field.onChange(value || "")} // Handle onChange safely
                              onBlur={field.onBlur} // Pass onBlur if needed
                              name={field.name} // Pass name if needed
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex items-center justify-end">
              <Button type="submit" variant="destructive" className="my-4">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanySecretary;
