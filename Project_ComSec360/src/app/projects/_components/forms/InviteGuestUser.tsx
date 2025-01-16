"use client";

import { GuestUserFormSchema } from "@/lib/validationSchemas";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InviteGuestUsers = ({ text }: { text: string }) => {
  const [disable, setDisable] = useState(false);
  // const shareCapitalData = useShareCapitalStore(
	// 	(state) => state.shareCapitalData,
	// );

  const form = useForm<z.infer<typeof GuestUserFormSchema>>({
    resolver: zodResolver(GuestUserFormSchema),
    defaultValues: {
      name: undefined,
      email: undefined,
      shareDetails: [
        {
          classOfShares: "Ordinary",
          noOfShares: 800,
        },
      ],
    },
  });
  
  const control = form.control;
  const { fields, append, remove } = useFieldArray({
    name: "shareDetails",
    control,
  });

  const inviteGuestUserRows = [
    {
      label: "Name",
      for: "name",
    },
    {
      label: "Email",
      for: "email",
    },
  ];

  // Submit Handler.
  function onSubmit(values: z.infer<typeof GuestUserFormSchema>) {
    console.log("Backend is yet to be initialized");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite {text}</CardTitle>
        <CardDescription>
          Please enter information to invite {text} to fill the form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <Table>
              <TableHeader>
                <TableRow>
                  {inviteGuestUserRows.map((row) => (
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
                  <TableCell>
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Eg: xyz@email.com"
                              {...field}
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
            <Table className={cn({
              hidden: text === "Director"
            })}>
              <TableHeader>
                <TableRow>
                  <TableHead>Class of Shares</TableHead>
                  <TableHead>No. of Shares</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                    <span
                      className={buttonVariants()}
                      onClick={() =>
                        append({
                          classOfShares: "",
                          noOfShares: 0,
                        })
                      }
                    >
                      <PlusCircle />
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <FormItem>
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Class of Shares" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Class of Shares</SelectLabel>
                                {/* {shareCapitalData.map((item) => (
                                  <SelectItem key={item.id} value={item.class}>
                                    <div className="flex gap-3">
                                      <span className="font-medium">
                                        {item.class}
                                      </span>
                                      <span className="font-light">
                                        {item.unpaid}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))} */}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </TableCell>
                    <Controller
                      render={({ field }) => (
                        <TableCell>
                          <Input {...field} type="number" />
                        </TableCell>
                      )}
                      name={`shareDetails.${index}.noOfShares`}
                    />
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <Button type="submit" className="my-4">
                Invite
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InviteGuestUsers;