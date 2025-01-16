"use client";

import { DirectorsFormSchema } from "@/app/validationSchemas";
import TooltipComponent from "@/components/Tooltip/Tooltip";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PhoneInput } from "../ui/phone-input";
import { toast } from "../ui/use-toast";
import { addDirectorData, uploadFileProof } from "@/api/guestDirector";

const Directors = () => {
  const [disable, setDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [idProof, setIdProof] = useState("");
  const [addressProof, setAddressProof] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [inviteId, setInviteId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email");
      const companyId = localStorage.getItem("companyId");
      const id = localStorage.getItem("id");
      if (email) setEmail(email);
      if (companyId) setCompanyId(companyId);
      if (id) setInviteId(id);
    }
  }, []);

  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email]);


  const handleIdProofUpload = async (file: File) => {
    try {
      const response = await uploadFileProof(file, companyId, "idProof");
      if (response.data.location) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
          variant: "default",
        });
        setIdProof(response.data.location);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "File upload failed",
        variant: "destructive",
      });
    }
  };

  const handleAddressProofUpload = async (file: File) => {
    try {
      const response = await uploadFileProof(file, companyId, "addressProof");
      if (response.data.location) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
          variant: "default",
        });
        setAddressProof(response.data.location);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "File upload failed",
        variant: "destructive",
      });
    }
  };
  const form = useForm<z.infer<typeof DirectorsFormSchema>>({
    resolver: zodResolver(DirectorsFormSchema),
    defaultValues: {
      type: "person",
      surname: "",
      name: "",
      idNo: "",
      address: "",
      email: email,
      phone: "",
      idProof: undefined,
      addressProof: undefined,
    },
  });
  const IDFileRef = form.register("idProof", { required: true });
  const AddressFileRef = form.register("addressProof", { required: false });

  const DirectorsRows = [
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

  // Submit Handler.
  async function onSubmit(values: z.infer<typeof DirectorsFormSchema>) {
    console.log(values);
    if (idProof) {
      values.idProof = idProof;
    } else {
      toast({
        title: "Error",
        description: "Please upload ID proof",
        variant: "destructive",
      });
      return;
    }
    if (addressProof) {
      values.addressProof = addressProof;
    } else {
      values.addressProof = "";
    }
    const response = await addDirectorData(values, companyId, parseInt(inviteId));
    if (!response.data) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Success!!",
        variant: "default",
        description: "Director has been updated successfully!!",
      });
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

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <Table>
          <TableHeader>
            <TableRow>
              {DirectorsRows.slice(0, 4).map((row) => (
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
                          placeholder={`${
                            disable ? "Company" : "ID"
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
                          {...IDFileRef}
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
              {DirectorsRows.slice(4, 9).map((row) => (
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
                          placeholder="Name Eg: No.1 Jianguomenwai Avenue"
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
                            {...AddressFileRef}
                            {...AddressFileRef}
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
                          readOnly
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
                          value={field.value as string & { __tag: "E164Number"; }} // Transform value to match expected type
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
        <div>
          <Button type="submit" variant="destructive" className="my-4">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Directors;
