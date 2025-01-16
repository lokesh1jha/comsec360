"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LinkButton from "../LinkButton";
import Link from "next/link";
import { getDirector, signDirectorDocuments } from "@/api/director";
import { DocumentInterface, DirectorDocuments } from "../Main";

const formSchema = z.object({
  sign: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const UploadFormTable = ({ directorDocuments, documents }: { directorDocuments: DirectorDocuments, documents: DocumentInterface[] }) => {
  const [signPreview, setsignPreview] = useState("-");
  const [type, setType] = useState(directorDocuments.type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sign: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const resp = await signDirectorDocuments(directorDocuments.companyId, values.sign);
    if (resp.success) {
      console.log("Successfully signed the document");
      alert("Successfully signed the document");
    } else {
      console.log("Failed to sign the document");
    }
  }

  const getStatus = (documentName: string) => {
    switch (documentName) {
      case "NNC1 Form":
        return (
          <Link
            href="/documents/NNC1.pdf"
            download
            className={buttonVariants({ variant: "link" })}
          >
            Download & Send Signed Physical Copy to your Account User
          </Link>
        );
      case "Article of Association (A & A)":
      case "IRBRI":
        return <span className="text-muted-foreground">No Sign Needed</span>;
      case "Ordinary Share Agreement":
        return (
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="sign"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Type Your Initials..."
                      {...field}
                      onChange={(e) => {
                        form.setValue("sign", e.target.value);
                        setsignPreview(form.getValues("sign"));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </div>
        );
      case "Minutes":
        return (
          <div className="font-greatvibes text-4xl">
            <span className="font-sans text-base">Your Sign Preview :&nbsp;</span>
            {signPreview}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Status</CardTitle>
        <CardDescription>
          This is the status of documents prepared by the project of your
          company.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No.</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Review your Documents</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document, index) => (
                  <TableRow key={document.name}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{document.name}</TableCell>
                    <TableCell>
                      <LinkButton href={document.url} />
                    </TableCell>
                    <TableCell>{getStatus(document.name)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadFormTable;
