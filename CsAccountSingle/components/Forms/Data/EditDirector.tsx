"use client";

import { DirectorsFormSchema, DirectorsUpdateFormSchema } from "@/app/validationSchemas";
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
import { useToast } from "@/components/ui/use-toast";
import { useDataContext } from "@/context/ContextProvider";
import { useDirectorStore } from "@/store/directorStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const EditDirector = ({ id }: { id: number }) => {
    const { toast } = useToast();
    const directorData = useDirectorStore(
        (state) => state.directorData);

    const updateDirectorData = useDirectorStore(
        (state) => state.updateDirectorData);
        
    const { companyId } = useDataContext();

    function getObjectById(id: number) {
        return directorData.find((item) => item.id === id);
    }
    const tracedObject = getObjectById(id);

    const form = useForm<z.infer<typeof DirectorsUpdateFormSchema>>({
        resolver: zodResolver(DirectorsUpdateFormSchema),
        defaultValues: {
            name: tracedObject?.name,
            email: tracedObject?.email,
            phone: tracedObject?.phone,
            address: tracedObject?.address,
        },
    });

    function onSubmit(values: z.infer<typeof DirectorsUpdateFormSchema>) {
        let newData = {
            name: values.name,
            email: values.email ?? "",
            phone: values.phone,
            address: values.address,
        };
        
        updateDirectorData(newData, companyId);
        toast({
            title: "Updated!",
            description: "The director has been updated successfully.",
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
                    <DialogTitle>Edit Director</DialogTitle>
                    <DialogDescription>
                        Make changes to the Director&#39;s details. Click save when you&apos;re done.
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

export default EditDirector;
