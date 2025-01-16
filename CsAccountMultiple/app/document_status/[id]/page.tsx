"use client"

import { getDocumentsData, getProjectUserDeatils } from "@/api/company";
import ButtonLink from "@/components/ButtonLink";
import { SignPopup, UploadPopup } from "@/components/Popups";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { data } from "@/lib/constants";
import { Slash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface ProjectUserDetails {
  id: number;
  name: string;
  position: string;
  type: string;
  idProof: string;
  addressProof: string | null;
  uploadType: string;
  NNC1Url: string | null;
}

interface DocumentData {
  name: string;
  previewLink: string;
  status: string;
  signed_count?: string;
  printLink: string;
}

interface DocumentStatus {
  [key: string]: {
    type: string;
    NNC1: string;
    minutes?: string;
    ordinaryShareAgreement?: string;
  };
}

interface FormattedData {
  id: number;
  name: string;
  url: string;
  isSignedRequired: boolean;
  status: DocumentStatus;
}


const Page = ({ params }: { params: { id: string } }) => {
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [userData, setUserData] = useState<ProjectUserDetails[]>([]);
  const [documentData, setDocumentData] = useState<DocumentData[]>([]);
  const [formattedData, setFormattedData] = useState<FormattedData[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const projectToFetch = data.find((project) => project.id === params?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userDetailsResponse, documentDataResponse] = await Promise.all([
          getProjectUserDeatils(params.id),
          getDocumentsData(params.id),
        ]);

        setUserData(userDetailsResponse.data);
        setFormattedData(userDetailsResponse.formattedDocuments);
        setDocumentData(documentDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const companyid = localStorage.getItem("companyId");
      setCompanyId(companyid || "");
    }
  }, []);

  useEffect(() => {
    setIsConfirmEnabled(userData.every((user) => user.NNC1Url));
  }, [userData]);


  return (
    <Card className="my-6 container">
      <Breadcrumb className="py-4 px-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{projectToFetch?.company}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>
              Project - {projectToFetch?.project} (id: {params.id})
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardHeader className="flex justify-between items-center w-full flex-row">
        <div className="space-y-2">
          <CardTitle>Document Status</CardTitle>
          <CardDescription>
            This is the status of documents prepared by the project of your
            company.
          </CardDescription>
        </div>
        <Link
          href={`/document_status/${companyId}/documents`}
          className={buttonVariants({ size: "lg", variant: "default", className: !isConfirmEnabled ? "opacity-50 cursor-not-allowed" : "" })}
        >
          Confirm
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No.</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Generated</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedData && formattedData.map((document, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{document.name}</TableCell>
                <TableCell>
                  <Link
                    className={buttonVariants({
                      variant: "outline",
                      className: "cursor-pointer",
                    })}
                    href={document.url}
                    target="_blank"
                  >
                    Preview
                  </Link>
                </TableCell>
                <TableCell>
                  {document.isSignedRequired ? (
                    <SignPopup text={`1Signed`} status={document.status} name={document.name.replaceAll(" ", "").toLowerCase()} />
                  ) : (
                    <Link
                      className={buttonVariants({
                        variant: "outline",
                        className: "cursor-pointer",
                      })}
                      href={document.url}
                      target="_blank"
                    >
                      Print
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Details about Users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No.</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Print</TableHead>
                  <TableHead>Upload Signed NNC1</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {userData && userData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell className="space-x-1.5">
                      <ButtonLink href={user.idProof} toolTipContent="Print ID Proof" />
                      {user.addressProof && (
                        <ButtonLink href={user.addressProof} toolTipContent="Print Address Proof" />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.NNC1Url ? (
                        <ButtonLink href={user.NNC1Url} toolTipContent="View Signed NNC1" />
                      ) : (
                        user.uploadType === "Person" ? (
                          <UploadPopup type="Person" user={{ position: user.position, id: user.id }} />
                        ) : (
                          <UploadPopup type="Company" user={{ position: user.position, id: user.id }} />
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Page;
