"use client";

import { ShareCapitalFormSchema } from "@/lib/validationSchemas";
import { RightsHoverCard } from "@/components/hovercards";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currencyContent, shareCapitalRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import CustomFormField from "@/components/CustomFormFields";
import { useShareCapitalStore } from "@/store/ShareCapitalStore";
import { toast } from "react-hot-toast";

const ShareCapitalForm = () => {
  const { shareCapitalData, addShareCapitalData } = useShareCapitalStore();
  const form = useForm<z.infer<typeof ShareCapitalFormSchema>>({
    resolver: zodResolver(ShareCapitalFormSchema),
    defaultValues: {
      class: "Ordinary",
      totalProposed: 10000.0,
      currency: "HKD",
      unitPrice: 1.0,
      total: 10000.0,
      paid: 10000.0,
      unpaid: 0,
      rightsAttached: undefined,
    },
  });

  const handleTotalSharesChange = (value: number) => {
    const currentValue = form.getValues("unitPrice");
    const totalAmount = value * currentValue;
    form.setValue("total", totalAmount);
  };

  const handleValueChange = (value: number) => {
    const currentShares = form.getValues("totalProposed");
    const totalAmount = currentShares * value;
    form.setValue("total", totalAmount);
  };

  const handlePaidChange = (value: number) => {
    const totalAmount = form.getValues("total");
    form.setValue("unpaid", totalAmount - value);
  };

  // Submit Handler.
  const onSubmit = (values: z.infer<typeof ShareCapitalFormSchema>) => {
    console.log(values);
    const newId = Math.max(...shareCapitalData.map((entry) => entry.id), 0) + 1;
    const newValues = {
      id: newId,
      ...values,
    };
    addShareCapitalData(newValues);
    toast.success("Success!! Field has been Added Successfully!!");
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <Table>
          <TableHeader>
            <TableRow>
              {shareCapitalRows.map((row) => (
                <TableHead key={row.for}>
                  <FormLabel
                    htmlFor={row.for}
                    className={cn({
                      "inline-flex gap-2 items-center":
                        row.for === "rightsAttached",
                    })}
                  >
                    {row.label}
                  </FormLabel>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <CustomFormField
                  name="class"
                  control={form.control}
                  placeholder="Eg: Ordinary, Preferance"
                />
              </TableCell>
              <TableCell>
                <FormField
                  name="totalProposed"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="XXXX"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTotalSharesChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  name="currency"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue="HKD">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencyContent.map((item) => (
                            <SelectItem value={item} key={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  name="unitPrice"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="XXXX"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleValueChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <CustomFormField
                  type="number"
                  name="total"
                  placeholder="XXXXX"
                  control={form.control}
                  readOnly
                />
              </TableCell>
              <TableCell>
                <FormField
                  name="paid"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handlePaidChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <CustomFormField
                  type="number"
                  name="unpaid"
                  control={form.control}
                  readOnly
                  placeholder="XXXX"
                />
              </TableCell>
              <TableCell>
                <CustomFormField
                  name="rightsAttached"
                  control={form.control}
                  placeholder="Voting Rights, etc."
                  hoverCard={<RightsHoverCard />}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="p-3">
          <Button type="submit">Add Share</Button>
        </div>
      </form>
    </Form>
  );
};

export default ShareCapitalForm;
