"use client";

import { CompanyInfoFormSchema } from "@/app/validationSchemas";
import { Check, ChevronsUpDown } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HoverCardComponent } from "@/components/HoverCard";
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

import * as RPNInput from "react-phone-number-input";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDataContext } from "@/context/ContextProvider";
import {
  CompanyInfoHoverContent,
  NatureOfBusinessContent,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getCompanyDetailsByCompanyId, submitCompanyDetails, uploadCompanyLogo } from "@/lib/api/company";
import { toast } from "../ui/use-toast";

const CompanyInfo = () => {
  const { companyId, setTabValue, setDisableSI, setCompanyId } = useDataContext();
  const [disable, setDisable] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filteredContent, setFilteredContent] = useState(
    NatureOfBusinessContent
  );
  const [companyLogo, setCompanyLogo] = useState(null);
  if (companyId) {
    setDisableSI(false);
  }
  // if companyId is not empty, get the comany details and set the form values

  useEffect(() => {
    if (companyId) {
      const fetchCompanyDetails = async () => {
        // Remove older cached company details
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("companyDetails_") && key !== `companyDetails_${companyId}`) {
            localStorage.removeItem(key);
          }
        });

        const companyDetailsCache = localStorage.getItem(`companyDetails_${companyId}`) ? JSON.parse(localStorage.getItem(`companyDetails_${companyId}`) as string) : {};
        const companyDetailsSavedAt = localStorage.getItem(`companyDetails_${companyId}_savedAt`);
        // Check if the data is already in the cache
        if (companyDetailsCache && companyDetailsSavedAt && Date.now() - Number(companyDetailsSavedAt) < 10 * 60 * 1000) {
          console.log("Using cached company details");

          // if(!CompanyInfoFormSchema.safeParse(companyDetailsCache).success){
          //   localStorage.removeItem(`companyDetails_${companyId}`);
          //   localStorage.removeItem(`companyDetails_${companyId}_savedAt`);
          //   return;
          // }
          populateForm(companyDetailsCache);
        } else {
          console.log("Fetching company details from API");
          fetchCompanyDetailsFromAPI();
        }
      };


      const fetchCompanyDetailsFromAPI = async () => {
        const response = await getCompanyDetailsByCompanyId({ companyId });
        if (!response.success) {
          console.log("CompanyId removed from localstorage")
          localStorage.removeItem("companyId")
          setCompanyId("")
          return
        }
        const companyData = response.data;
        localStorage.setItem(`companyDetails_${companyId}`, JSON.stringify(companyData));
        localStorage.setItem(`companyDetails_${companyId}_savedAt`, Date.now().toString());
        populateForm(companyData);
      }
      const populateForm = (data: any) => {
        try {
          const {
            name, chiname, code, nature, type, house, building, street,
            district, country, email, companyTel, companyfax, time,
            presentorName, presentorChiName, presentorAddress, presentorTel,
            presentorFax, presentorEmail, presentorReferance, companyLogo
          } = data;
          console.log("companyLogo", house);
          form.setValue("name", name);
          form.setValue("chiname", chiname);
          form.setValue("code", code);
          form.setValue("nature", nature);
          form.setValue("type", type.toLowerCase());
          form.setValue("house", data.house);
          form.setValue("building", building);
          form.setValue("street", street);
          form.setValue("district", district);
          form.setValue("country", country);
          form.setValue("email", email);
          form.setValue("companyTel", companyTel);
          form.setValue("companyfax", companyfax);
          form.setValue("time", time);
          form.setValue("presentorName", presentorName);
          form.setValue("presentorChiName", presentorChiName);
          form.setValue("presentorAddress", presentorAddress);
          form.setValue("presentorTel", presentorTel);
          form.setValue("presentorFax", presentorFax);
          form.setValue("presentorEmail", presentorEmail);
          form.setValue("presentorReferance", presentorReferance);
          form.setValue("companyLogo", companyLogo);
          setCompanyLogo(companyLogo);
        }

        catch (e) {
          console.log(e)
          fetchCompanyDetailsFromAPI();
        }
      };
      fetchCompanyDetails();
    }
  }, [companyId, setCompanyLogo]);




  // upload company logo image
  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadCompanyLogo(file, companyId);
      console.log("location", response.data.location);
      if (response.data.location) {
        toast({
          title: "Success",
          description: "Company logo uploaded successfully",
          variant: "default",
        })
        setCompanyLogo(response.data.location);
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
      companyfax: "",
      time: "1 year",
      presentorName: "",
      presentorChiName: "",
      presentorAddress: "",
      presentorTel: "",
      presentorFax: "",
      presentorEmail: "",
      presentorReferance: "CompanyName-NNC1-06-03-2024",
      companyLogo: '',
    },
  });
  const LogoFileRef = form.register("companyLogo", { required: true });
  const checkDisable = () => {
    if (
      form.getValues("house")?.length === 0 &&
      form.getValues("building")?.length === 0 &&
      form.getValues("street")?.length === 0 &&
      form.getValues("district")?.length === 0
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  };

  const onCommandInputChange = (event: string) => {
    const value = event.toLowerCase();
    const filtered = NatureOfBusinessContent.filter((item) =>
      item.value.toLowerCase().includes(value)
    );
    setFilteredContent(filtered);
  };
  // Submit Handler.
  async function onSubmit(values: z.infer<typeof CompanyInfoFormSchema>) {
    console.log("logo check", values);
    if (companyLogo) {
      values.companyLogo = companyLogo
    } else {
      values.companyLogo = ''
    }
    let submitData: any = null;

    if (companyId) {
      //update
      submitData = await submitCompanyDetails(values, companyId);
    } else {
      //create

      submitData = await submitCompanyDetails(values);
    }
    console.log("submitData", submitData, submitData.data.id);
    if (submitData.success && submitData.data.id) {
      toast({
        title: "Success",
        description: submitData.message,
        variant: "default",
      })
      setCompanyId(submitData.data.id);
      setDisableSI(false);
      setTabValue("SI");
    } else {
      toast({
        title: "Error",
        description: submitData.message,
        variant: "destructive",
      })
    }
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
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-2">
                      <span>Company Name (English):</span>
                      <HoverCardComponent
                        content={
                          <ol className="space-y-3 list-[lower-alpha] *:leading-relaxed px-2 py-2">
                            <li>{CompanyInfoHoverContent.name.first}</li>
                            <li>{CompanyInfoHoverContent.name.second}</li>
                          </ol>
                        }
                        size={20}
                      />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="company name (English)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="chiname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name (Chinese):</FormLabel>
                    <FormControl>
                      <Input placeholder="company name (Chinese)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-2">
                      <span>Select Type of Company:</span>
                      <HoverCardComponent
                        content={
                          <span className=" leading-relaxed">
                            {CompanyInfoHoverContent.type}
                          </span>
                        }
                        size={20}
                      />
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex justify-start items-center gap-10"
                      >
                        <FormItem className="flex items-end space-x-3">
                          <FormControl>
                            <RadioGroupItem value="private" />
                          </FormControl>
                          <FormLabel className="font-normal">Private</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-end space-x-3">
                          <FormControl>
                            <RadioGroupItem value="public" disabled />
                          </FormControl>
                          <FormLabel className="font-normal text-muted-foreground">
                            Public
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 items-center">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code:</FormLabel>
                      <FormControl>
                        <Input placeholder="XXX" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="nature"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature of Business</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "md:w-[450px] w-auto h-auto justify-between text-pretty",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? field.value
                                : " Select Nature of Business"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="md:w-[450px] w-auto">
                          <Command>
                            <CommandInput
                              placeholder="Search Nature of Business..."
                              onValueChange={(currentValue) =>
                                onCommandInputChange(currentValue)
                              }
                            />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup>
                                {filteredContent.map((item) => (
                                  <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                      setValue(
                                        currentValue === value
                                          ? ""
                                          : currentValue
                                      );
                                      form.setValue("nature", item.value);
                                      form.setValue("code", item.code);
                                      setOpen(false);
                                      checkDisable();
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        value === item.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {item.value}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-3">
              <FormField
                name="house"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-2">
                      <span>Address: </span>
                      <HoverCardComponent
                        content={
                          <span className="leading-relaxed">
                            {CompanyInfoHoverContent.address}
                          </span>
                        }
                        size={20}
                      />
                      {disable && (
                        <span className="text-destructive">
                          You need to enter atleast one address field.
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Flat / Floor / Block"
                        {...field}
                        onChange={(e) => {
                          form.setValue("house", e.target.value);
                          checkDisable();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="building"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Building"
                        {...field}
                        onChange={(e) => {
                          form.setValue("building", e.target.value);
                          checkDisable();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="street"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Street"
                        {...field}
                        onChange={(e) => {
                          form.setValue("street", e.target.value);
                          checkDisable();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="district"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="District"
                        {...field}
                        onChange={(e) => {
                          form.setValue("district", e.target.value);
                          checkDisable();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="HongKong" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company E-mail:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="info@test1.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <FormField
                name="companyTel"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Telephone:</FormLabel>
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
              <FormField
                name="companyfax"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Fax No:</FormLabel>
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
            </div>
            <FormField
              name="time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" inline-flex items-center gap-2">
                    <span>
                      Choose how long period of Business Registration Fee:
                    </span>
                    <HoverCardComponent
                      content={
                        <span className=" leading-relaxed">
                          {CompanyInfoHoverContent.time}
                        </span>
                      }
                      size={20}
                    />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-start items-center gap-10"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1 year" />
                        </FormControl>
                        <FormLabel className="font-normal">1 Year</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3 years" />
                        </FormControl>
                        <FormLabel className="font-normal">3 Years</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
              <CardHeader>
                <CardTitle className="inline-flex items-center gap-2">
                  <span>Presentor&lsquo;s Referance</span>
                  <HoverCardComponent
                    content={
                      <span className=" font-normal leading-relaxed text-base">
                        {CompanyInfoHoverContent.presentor}
                      </span>
                    }
                    size={28}
                  />
                </CardTitle>
                <CardDescription>
                  Please enter info on Presentor&lsquo;s Referance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    name="presentorName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (English):</FormLabel>
                        <FormControl>
                          <Input placeholder="James Bond" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="presentorChiName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Chinese):</FormLabel>
                        <FormControl>
                          <Input placeholder="Name (Chinese)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="presentorAddress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Eg: 16, Taichi Street..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    name="presentorTel"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone:</FormLabel>
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
                  <FormField
                    name="presentorFax"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax No:</FormLabel>
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
                </div>
                <FormField
                  name="presentorEmail"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="info@test1.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="presentorReferance"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presentor&lsquo;s Referance:</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Eg: CompanyName-NNC1-06-03-2024"
                          {...field}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="companyLogo"
                  control={form.control}
                  render={({ field }) => (
                    <FormField
                      name="companyLogo"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo:</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  handleFileUpload(file);
                                  field.onChange(file);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                />
              </CardContent>
            </Card>
            <div className="flex justify-end items-center">
              <Button type="submit" variant="destructive" disabled={disable}>
                Save & Next
              </Button>
            </div>
          </form>
        </Form>
      </CardContent >
    </Card >
  );
};

export default CompanyInfo;
