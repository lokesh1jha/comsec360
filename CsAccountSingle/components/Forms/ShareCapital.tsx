"use client";

import { ShareCapitalFormSchema } from "@/app/validationSchemas";
import ShareCapitalData from "@/components/Forms/Data/ShareCapitalData";
import { HoverCardComponent } from "@/components/HoverCard";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { useToast } from "@/components/ui/use-toast";
import { useDataContext } from "@/context/ContextProvider";
import { currencyContent, shareCapitalRows } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { useShareHolderStore } from "@/store/shareHolderDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const ShareCapital = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const { companyId } = useDataContext();

  const shareCapitalData = useShareCapitalStore(state => state.shareCapitalData);
  const addShareCapitalData = useShareCapitalStore(state => state.addShareCapitalData);

  useEffect(() => {
    useShareCapitalStore.getState().fetchShareCapitalData(companyId);
    useShareHolderStore.getState().fetchShareHolderData(companyId);
  }, [companyId]);

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
  async function onSubmit(values: z.infer<typeof ShareCapitalFormSchema>) {
    console.log(values);

    let data = {
      companyId: companyId,
      ...values,
    };
    
    addShareCapitalData(data, companyId);
    toast({
      title: "Success!!",
      description: "Field has been Added Successfully!!",
    });
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card>
        <div className="flex flex-1 justify-between items-center">
          <CardHeader>
            <CardTitle>Share Capital</CardTitle>
            <CardDescription>
              Please enter information on Share Capital
            </CardDescription>
          </CardHeader>
          <CollapsibleTrigger type="button" className="pr-6">
            <span className={buttonVariants({ variant: "outline" })}>
              {isOpen ? "-" : "+"}
            </span>
          </CollapsibleTrigger>
        </div>
        <CardContent className="space-y-6">
          <CollapsibleContent className="CollapsibleContent">
            <ShareCapitalData />
          </CollapsibleContent>
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
                          {row.for === "rightsAttached" && (
                            <HoverCardComponent
                              size={24}
                              content={
                                <ol
                                  type="a"
                                  className="space-y-3 px-2 py-2 list-[lower-alpha]"
                                >
                                  <li>
                                    The particulars of any voting rights
                                    attached to shares in that class, including
                                    rights that arise only in certain
                                    circumstances
                                  </li>
                                  <li>
                                    The particulars of any rights attached to
                                    shares in that class, as respects dividends,
                                    to participate in a distribution
                                  </li>
                                  <li>
                                    The particulars of any rights attached to
                                    shares in that class, as respects capital,
                                    to participate in a distribution (including
                                    on a winding up)
                                  </li>
                                  <li>
                                    Whether or not shares in that class are
                                    redeemable shares
                                  </li>
                                </ol>
                              }
                            />
                          )}
                        </FormLabel>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <FormField
                        name="class"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              placeholder="Eg: Ordinary, Preferance..."
                              type="text"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
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
                                  handleTotalSharesChange(
                                    Number(e.target.value)
                                  );
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue="HKD"
                            >
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
                      <FormField
                        name="total"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                readOnly
                                placeholder="XXXX"
                                type="number"
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
                        name="paid"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
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
                      <FormField
                        name="unpaid"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                readOnly
                                placeholder="XXXX"
                                type="number"
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
                        name="rightsAttached"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              placeholder="Voting Rights, etc..."
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <Button type="submit">Add Share</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Collapsible>
  );
};

export default ShareCapital;
