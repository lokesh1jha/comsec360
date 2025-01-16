"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const CompanyRevise = ({ setChangeTab }: any) => {
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const currenturl = window.location.href;
    const urlParts = currenturl.split("/");
    const secondLastPart = urlParts[urlParts.length - 2];
    setCompanyId(secondLastPart);
  }, []);

  const goToNextTab = () => {
    setChangeTab("documents");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revise Company Details and Documents</CardTitle>
        <CardDescription>Revise your Company Details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          <div className="space-y-3">
            <CardDescription>
              Note: Clicking this will need to enter all the details again.
            </CardDescription>
            <Link
              href={`/document_status/${companyId}`}
              className={buttonVariants({ size: "lg", variant: "destructive" })}
            >
              Revert to Company Details
            </Link>
          </div>
          <div className="space-y-3">
            <CardDescription>
              If you don&apos;t want to revise the company details click on next to generate
            </CardDescription>
            <Button size="lg" onClick={goToNextTab}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyRevise;
