"use client";

import { ShareholdersUpdateFormSchema } from "@/app/validationSchemas";
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
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useShareCapitalStore } from "@/store/shareCapitalDataStore";
import { useShareHolderStore } from "@/store/shareHolderDataStore";
import { ShareholdersUpdateProps } from "@/store/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

const EditShareHolder = ({ id }: { id: number }) => {
    const { toast } = useToast();
    const shareHolderData = useShareHolderStore((state) => state.shareHolderData);
    const updateShareHolderData = useShareHolderStore(
        (state) => state.updateShareHolderData
    );
    const { companyId } = useDataContext();

    function getObjectById(id: number) {
        return shareHolderData.find((item) => item.id === id);
    }
    const tracedObject = getObjectById(id);

    const form = useForm<z.infer<typeof ShareholdersUpdateFormSchema>>({
        resolver: zodResolver(ShareholdersUpdateFormSchema),
        defaultValues: {
            name: tracedObject?.name,
            shareDetails: tracedObject?.sharesDetails,
            email: tracedObject?.email,
            phone: tracedObject?.phone,
            address: tracedObject?.address,
        },

    });
    const control = form.control;
    const { fields, remove } = useFieldArray({
        name: "shareDetails",
        control,
    });
    const shareCapitalData = useShareCapitalStore(
        (state) => state.shareCapitalData,
    );
    console.log("shareCapital data :", shareCapitalData)
    const onSubmit = (values:  z.infer<typeof ShareholdersUpdateFormSchema>) => {
        if (!values.email) {
            toast({
                title: "Error",
                description: "Email is required.",
                variant: "destructive",
            });
            return;
        }
        if (!values.email) return;
        let newData: ShareholdersUpdateProps = {
            name: values.name,
            address: values.address,
            phone: values.phone,
            email: values.email ?? "",
            shareDetails: values.shareDetails,
            // id: values.id
        };
        updateShareHolderData(newData, companyId);
        toast({
            title: "Updated!!",
            description: "The shareholder has been updated successfully.",
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit ShareHolder</DialogTitle>
                    <DialogDescription>
                        Make changes to the ShareHolder details. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 gap-5 py-3"
                    >
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input placeholder="Enter full name" type="text" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="py-2 px-4">Class of Shares</TableHead>
                                    <TableHead className="py-2 px-4">No. of Shares</TableHead>
                                    <TableHead className="py-2 px-4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="py-2 px-4">
                                            <FormItem>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            form.setValue(`shareDetails.${index}.classOfShares`, value)
                                                        }
                                                        defaultValue={item.classOfShares || ""}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select class" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Class of Shares</SelectLabel>
                                                                {shareCapitalData.map((share) => (
                                                                    <SelectItem
                                                                        key={share.id}
                                                                        value={`${share.class}-${share.id}`}
                                                                    >
                                                                        <span className="font-medium">{share.class}</span>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        </TableCell>
                                        <TableCell className="py-2 px-4">
                                            <Input
                                                {...form.register(`shareDetails.${index}.noOfShares`)}
                                                defaultValue={item.noOfShares || ""}
                                                type="number"
                                            />
                                        </TableCell>
                                        <TableCell className="py-2 px-4">
                                            <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                                <Trash2 />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>


                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input placeholder="Enter email" type="email" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="phone"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <Input
                                        placeholder="Enter contact number"
                                        type="text"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="address"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <Input
                                        placeholder="Enter address"
                                        type="text"
                                        {...field}
                                    />
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

export default EditShareHolder;
