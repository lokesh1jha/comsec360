"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ObtainDocumentsFormSchema } from "@/app/validationSchemas";
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
import { obtainCompanyDocuments } from "@/api/company";

const ObtainDocuments = ({ setChangeTab }: any) => {
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState("");

  const form = useForm<z.infer<typeof ObtainDocumentsFormSchema>>({
    resolver: zodResolver(ObtainDocumentsFormSchema),
  });

  useEffect(() => {
    const currenturl = window.location.href;
    const urlParts = currenturl.split("/");
    const secondLastPart = urlParts[urlParts.length - 2];
    setCompanyId(secondLastPart);
  }, []);

  const certificateRef = form.register("certificateOfIncorporate", {
    required: true,
  });
  const noticeRef = form.register("notice", { required: true });
  const recieptsRef = form.register("reciepts");

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("certificateOfIncorporate", data.certificateOfIncorporate[0]);
      formData.append("notice", data.notice[0]);
      if (data.reciepts && data.reciepts.length > 0) {
      formData.append("reciepts", data.reciepts[0]);
      }
      formData.append("incorporate", date ? format(date, "yyyy-MM-dd") : "");

      const response = await obtainCompanyDocuments(companyId, formData);
      if (response.success) {
      setChangeTab("certificate");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Obtain the company certificate & documents from Companies Registry
        </CardTitle>
        <CardDescription>These documents will be published</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="incorporate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Incorporate Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className=" w-auto p-0">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          if (selectedDate) {
                            form.setValue("incorporate", selectedDate);
                          }
                        }}
                        fromYear={1960}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certificateOfIncorporate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate of Incorporate</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Certificate of Incorporate"
                      type="file"
                      {...certificateRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-3">
              <FormField
                name="noticeNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Eg: XXXX" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Notice</FormLabel>
                    <FormControl>
                      <Input placeholder="Notice" type="file" {...noticeRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reciepts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Reciepts"
                      type="file"
                      {...recieptsRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ObtainDocuments;
