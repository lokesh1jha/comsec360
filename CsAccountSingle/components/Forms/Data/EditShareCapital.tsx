"use client";
import { ShareCapitalFormSchema } from "@/app/validationSchemas";
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
import { useToast } from "@/components/ui/use-toast";
import { useDataContext } from "@/context/ContextProvider";
import { currencyContent } from "@/lib/constants";
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const EditShareCapital = ({ id }: { id: number }) => {
  const { toast } = useToast();
  const { companyId } = useDataContext();

  const shareCapitalData = useShareCapitalStore(
    (state) => state.shareCapitalData
  );

  const updateShareCapitalData = useShareCapitalStore(
    (state) => state.updateShareCapitalData
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
    updateShareCapitalData({ id: id, ...values }, companyId);
    toast({
      title: "Updated!!",
      description: "The field has been updated successfully.",
    });
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
          <DialogTitle>Edit ShareCapital</DialogTitle>
          <DialogDescription>
            Make changes to your ShareCapital. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5 py-3"
          >
            <FormField
              name="class"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class of Shares</FormLabel>
                  <Input
                    placeholder="Eg: Ordinary, Preferance..."
                    type="text"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
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
            <FormField
              name="total"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <Input readOnly placeholder="XXXX" type="number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
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
            <FormField
              name="unpaid"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unpaid Amount</FormLabel>
                  <Input readOnly placeholder="XXXX" type="number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="rightsAttached"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rights Attached</FormLabel>
                  <Input placeholder="Eg: Voting..." type="text" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShareCapital;
