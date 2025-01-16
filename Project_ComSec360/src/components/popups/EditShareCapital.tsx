"use client";
import { ShareCapitalFormSchema } from "@/lib/validationSchemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencyContent } from "@/lib/constants";
import { useShareCapitalStore } from "@/store/ShareCapitalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import CustomFormField from "../CustomFormFields";

const EditShareCapital = ({ id }: { id: number }) => {
  const shareCapitalData = useShareCapitalStore(
    (state) => state.shareCapitalData,
  );
  const updateShareCapitalData = useShareCapitalStore(
    (state) => state.updateShareCapitalData,
  );

  function getObjectById(id: number) {
    return shareCapitalData.find((item) => item.id === id);
  }
  const tracedObject = getObjectById(id);

  const form = useForm<z.infer<typeof ShareCapitalFormSchema>>({
    resolver: zodResolver(ShareCapitalFormSchema),
    defaultValues: {
      class: tracedObject?.class,
      totalProposed: tracedObject?.totalProposed,
      currency: tracedObject?.currency,
      unitPrice: tracedObject?.unitPrice,
      total: tracedObject?.total,
      paid: tracedObject?.paid,
      unpaid: tracedObject?.unpaid,
      rightsAttached: tracedObject?.rightsAttached,
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

  function onSubmit(values: z.infer<typeof ShareCapitalFormSchema>) {
    updateShareCapitalData({ id: id, ...values });
    toast.success("Updated!! The field has been updated successfully.");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit ShareCapital ( id: {id} )</DialogTitle>
          <DialogDescription>
            Make changes to your ShareCapital. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5 py-3"
          >
            <CustomFormField
              name="class"
              control={form.control}
              label="Class of Shares"
              placeholder="Eh: Ordinary, Preferance..."
            />
            <FormField
              name="totalProposed"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Shares Proposed</FormLabel>
                  <Input
                    placeholder="XXXX"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTotalSharesChange(Number(e.target.value));
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="currency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="HKD">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        {currencyContent.map((item) => (
                          <SelectItem value={item} key={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name="unitPrice"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price of Share</FormLabel>
                  <Input
                    placeholder="XXXX"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleValueChange(Number(e.target.value));
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomFormField
              type="number"
              name="total"
              control={form.control}
              label="Total Amount"
              placeholder="XXXX"
              readOnly
            />
            <FormField
              name="paid"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Capital Subscribed</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handlePaidChange(Number(e.target.value));
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomFormField
              type="number"
              name="unpaid"
              control={form.control}
              label="Unpaid Amount"
              placeholder="XXXX"
              readOnly
            />
            <CustomFormField
              name="rightsAttached"
              control={form.control}
              label="Rights Attached"
              placeholder="Eg: Voting..."
            />
            <div>
              
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShareCapital;
